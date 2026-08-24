import { Button } from '@meemoo/react-components';
import { Spinner } from '@viaa/avo2-components';
import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import clsx from 'clsx';
import React, {
	type FunctionComponent,
	type ReactElement,
	type ReactNode,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { BlockHeading } from '~content-blocks/BlockHeading';
import { ImageOrAudioWaveForm } from '~modules/content-page/components/ImageOrAudioWaveForm/ImageOrAudioWaveForm.tsx';
import { getRandomTertiaryBackgroundColor } from '~modules/content-page/helpers/get-random-tertiary-background-color.ts';
import type { Color } from '~modules/content-page/types/content-block.types.ts';
import { IeObjectsService } from '~modules/ie-objects/ie-objects.service.ts';
import { SmartLink } from '~modules/shared/components/SmartLink/SmartLink';
import { Icon } from '~shared/components/Icon';
import { Link } from '~shared/components/Link';
import { BREAKPOINTS } from '~shared/consts/breakpoints.ts';
import { getIconFromObjectType } from '~shared/helpers/get-icon-from-object-type';
import { tText } from '~shared/helpers/translation-functions';
import { HET_ARCHIEF } from '~shared/types';
import type { BlockObjectsGridProps, ObjectsGridItem, OrderedTile } from './BlockObjectsGrid.types';
import { useGetObjectsGridItems } from './hooks/useGetObjectsGridItems';
import './BlockObjectsGrid.scss';

// 4 rows of 4 items per row when there are no fixed items present
// https://meemoo.atlassian.net/wiki/spaces/HA2/pages/6217171023/FA+Objecten+grid#Gedrag-van-het-contentblok
const OBJECT_GRID_MAX_ITEMS = 16;

export const BlockObjectsGrid: FunctionComponent<BlockObjectsGridProps> = ({
	className,
	title,
	titleType = 'h2',
	searchQuery,
	elements = [],
	backgroundColor,
}): ReactNode => {
	const fixedItems = elements.map((element) => element.mediaItem).filter((item) => item?.value);
	// Items to fetch is: max - 2 * fixed items, because fixed items are double width
	const { data, isLoading, isError } = useGetObjectsGridItems(
		searchQuery,
		fixedItems,
		OBJECT_GRID_MAX_ITEMS - fixedItems.length * 2
	);

	// Skeleton layout shown while the objects are still being fetched. How many tiles there will
	// be -- and which of them are double width -- is already known from the block config (the
	// fixed positions) and the max item count, so the grid can take up its final size right away
	// with a spinner per tile, instead of the whole block popping into existence once the
	// response lands. Same idea as the hero carousel's slides.
	const placeholderTiles = useMemo<{ isFixed: boolean }[]>(() => {
		const fixedCount = fixedItems.length;
		const randomCount = OBJECT_GRID_MAX_ITEMS - fixedCount * 2;

		// Same interleave as the loaded tiles below, so the skeleton's row layout matches the
		// layout the real tiles end up in.
		return [
			...(fixedCount > 0 ? [{ isFixed: true }] : []),
			...Array.from({ length: Math.min(2, randomCount) }, () => ({ isFixed: false })),
			...Array.from({ length: Math.max(fixedCount - 1, 0) }, () => ({ isFixed: true })),
			...Array.from({ length: Math.max(randomCount - 2, 0) }, () => ({ isFixed: false })),
		];
	}, [fixedItems.length]);

	// Each tile gets its own random tertiary color: the background of its wave form (audio items
	// with no thumbnail image) and of its loading tile. Picked once and then left alone so it
	// stays stable across re-renders (e.g. a window resize recalculating the visible columns) and
	// so a tile doesn't change colour the moment its object lands -- hence the count being the
	// larger of the skeleton and the loaded result set, which for a full grid is the same number.
	// One color per tile position (matched up by index below) rather than a map keyed by
	// schemaIdentifier: the same object can appear more than once (e.g. pinned as a fixed position
	// and also returned among the random results), which a key derived from the item would
	// collapse into a shared color.
	const totalItemCount = (data?.fixedObjects?.length ?? 0) + (data?.objects?.length ?? 0);
	const tileCount = Math.max(totalItemCount, placeholderTiles.length);
	const tileBackgroundColors = useMemo(
		() => Array.from({ length: tileCount }, () => getRandomTertiaryBackgroundColor()),
		[tileCount]
	);

	// Tracks viewport width so the tablet/mobile breakpoints can hide tiles that would
	// otherwise leave the last row half-filled (desktop always fetches an exact 4 rows).
	const [windowWidth, setWindowWidth] = useState<number>(() =>
		typeof window === 'undefined' ? BREAKPOINTS.desktop : window.innerWidth
	);

	useEffect(() => {
		const handleResize = (): void => setWindowWidth(window.innerWidth);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Number of grid columns and rows shown per breakpoint (see FA linked above).
	const getColumnsForWidth = (width: number): number => {
		if (width >= BREAKPOINTS.desktop) {
			return 4;
		}
		if (width >= BREAKPOINTS.tablet) {
			return 3;
		}
		return 1;
	};

	// Packs tiles into rows the same way the CSS grid renders them (auto-flow row, not dense):
	// a fixed (2-column-wide) tile that doesn't fit the remaining space in a row wraps to the
	// next row, leaving the remainder of the current row empty.
	const packTilesIntoRows = <T extends { isFixed: boolean }>(
		tiles: T[],
		columns: number
	): T[][] => {
		const rows: T[][] = [];
		let currentRow: T[] = [];
		let usedColumns = 0;

		tiles.forEach((tile) => {
			// Fixed tiles span 2 columns, except on mobile where the grid is a single column
			// wide and they span 1 like every other tile (see BlockObjectsGrid.scss).
			const width = tile.isFixed ? Math.min(2, columns) : 1;
			if (usedColumns + width > columns) {
				rows.push(currentRow);
				currentRow = [];
				usedColumns = 0;
			}
			currentRow.push(tile);
			usedColumns += width;
		});
		if (currentRow.length > 0) {
			rows.push(currentRow);
		}
		return rows;
	};

	// Limits the tiles to what fits in the max number of rows for this breakpoint, dropping
	// tiles from an incomplete trailing row so the last visible row is always fully filled.
	const getVisibleTiles = <T extends { isFixed: boolean }>(tiles: T[], columns: number): T[] => {
		const visibleRows = packTilesIntoRows(tiles, columns);

		// Find the last row
		const lastRow = visibleRows[visibleRows.length - 1];
		// Count how many cells are used on the last row
		// Double width tiles are counted double
		// Single width tiles are counted single
		const lastRowUsedColumns = lastRow?.reduce((sum, tile) => sum + (tile.isFixed ? 2 : 1), 0) ?? 0;
		if (lastRow && lastRowUsedColumns < columns) {
			visibleRows.pop();
		}

		return visibleRows.flat();
	};

	// The searchQuery is a full url pointing to the search page on hetarchief.be, but since this
	// admin-core module is embedded on that same site, we want a relative link instead of an
	// absolute one pointing to a specific domain (eg qas./int./prod.hetarchief.be).
	const stripDomain = (url: string): string => {
		try {
			const parsed = new URL(url);
			return `${parsed.pathname}${parsed.search}${parsed.hash}`;
		} catch {
			return url;
		}
	};

	// A tile whose object hasn't been resolved yet: the box is already at its final size (the
	// grid sizes it), so it only needs to show that something is on its way.
	const renderPlaceholderTile = (
		isFixed: boolean,
		index: number,
		tileBackgroundColor?: Color
	): ReactElement => (
		<li
			className={clsx('c-block-objects-grid__tile', {
				'c-block-objects-grid__tile--fixed': isFixed,
			})}
			key={`objects-grid-placeholder__${index}`}
			// The aria-live status below already announces that the objects are loading.
			aria-hidden="true"
		>
			<div
				className="c-block-objects-grid__tile-media c-block-objects-grid__tile-media--loading"
				style={tileBackgroundColor ? { backgroundColor: tileBackgroundColor } : undefined}
			>
				<Spinner size="large" locationId={'objects-grid-tile'} />
			</div>
		</li>
	);

	const renderTile = (
		item: ObjectsGridItem,
		isFixed: boolean,
		tileBackgroundColor?: Color
	): ReactElement => {
		// Same signal the search page uses to decide between the plain and the struck-through
		// ("no-…") type icon: the search proxy only resolves a thumbnail for objects whose
		// essence the current user may see.
		const isAccessible = Boolean(item.thumbnailUrl);
		const iconName = item.type ? getIconFromObjectType(item.type, isAccessible) : undefined;

		return (
			<li
				className={clsx('c-block-objects-grid__tile', {
					'c-block-objects-grid__tile--fixed': isFixed,
				})}
				key={`objects-grid-tile__${item.schemaIdentifier}`}
			>
				<SmartLink
					action={{
						type: AvoCoreContentPickerType.INTERNAL_LINK,
						value: IeObjectsService.getObjectDetailPath(item.schemaIdentifier),
					}}
					removeStyles={false}
					className="c-block-objects-grid__tile-link"
					ariaLabel={tText(
						'modules/content-page/components/blocks/block-objects-grid/block-objects-grid___ga-naar-de-detailpagina-van-title',
						{ title: item.name },
						[HET_ARCHIEF]
					)}
				>
					<div
						className={clsx(
							'c-block-objects-grid__tile-media',
							`c-block-objects-grid__tile-media--${item.type}`
						)}
					>
						{item.thumbnailUrl ? (
							<ImageOrAudioWaveForm
								imageSrc={item.thumbnailUrl}
								imageAlt={item.name}
								backgroundColor={tileBackgroundColor}
								size={isFixed ? 'large' : 'small'}
								className="c-block-objects-grid__tile-image"
							/>
						) : (
							// No thumbnail (e.g. audio): decorative placeholder, the link already carries the name.
							<span className="c-block-objects-grid__tile-placeholder" aria-hidden="true">
								{iconName && <Icon name={iconName} />}
							</span>
						)}
					</div>
					<div className="c-block-objects-grid__tile-titlebar">
						<div className="c-block-objects-grid__tile-titlebar-left">
							<span className="c-block-objects-grid__tile-title">{item.name}</span>
							{item.maintainerName && (
								<span className="c-block-objects-grid__tile-maintainer">{item.maintainerName}</span>
							)}
						</div>
						{iconName && <Icon className="c-block-objects-grid__tile-type-icon" name={iconName} />}
					</div>
				</SmartLink>
			</li>
		);
	};

	const fixedObjects = data?.fixedObjects ?? [];
	const objects = data?.objects ?? [];

	// Interleave order (see functional analysis): the first fixed object, then 2 random results,
	// then the remaining fixed objects, then the rest of the random results.
	// e.g. F1, R, R, F2, F3, R, R, … — with fixed tiles spanning 2 columns this puts F1 on row 1
	// and F2/F3 on row 2.
	const [firstFixed, ...restFixed] = fixedObjects;
	const orderedTiles: OrderedTile[] = [
		...(firstFixed ? [{ item: firstFixed, isFixed: true }] : []),
		...objects.slice(0, 2).map((item) => ({ item, isFixed: false })),
		...restFixed.map((item) => ({ item, isFixed: true })),
		...objects.slice(2).map((item) => ({ item, isFixed: false })),
	];

	const columns = getColumnsForWidth(windowWidth);
	const visibleTiles = getVisibleTiles(orderedTiles, columns);
	const visiblePlaceholders = getVisibleTiles(placeholderTiles, columns);
	const hasObjects = visibleTiles.length > 0;

	return (
		<section
			className={clsx('c-block-objects-grid', className)}
			style={backgroundColor ? { backgroundColor } : undefined}
			aria-label={
				title ||
				tText(
					'modules/content-page/components/blocks/block-objects-grid/block-objects-grid___objecten-grid',
					undefined,
					[HET_ARCHIEF]
				)
			}
		>
			{title && (
				<BlockHeading className="c-block-objects-grid__title" type={titleType}>
					{title}
				</BlockHeading>
			)}

			{/* Screen-reader status for the dynamic (async) content. */}
			<output className="c-block-objects-grid__sr-only" aria-live="polite">
				{isLoading &&
					tText(
						'modules/content-page/components/blocks/block-objects-grid/block-objects-grid___objecten-worden-geladen',
						undefined,
						[HET_ARCHIEF]
					)}
				{isError &&
					tText(
						'modules/content-page/components/blocks/block-objects-grid/block-objects-grid___er-konden-geen-objecten-geladen-worden',
						undefined,
						[HET_ARCHIEF]
					)}
				{!isLoading &&
					!isError &&
					!hasObjects &&
					tText(
						'modules/content-page/components/blocks/block-objects-grid/block-objects-grid___er-zijn-geen-objecten-gevonden',
						undefined,
						[HET_ARCHIEF]
					)}
			</output>

			{isLoading && (
				<ul className="c-block-objects-grid__grid">
					{visiblePlaceholders.map(({ isFixed }, index) =>
						renderPlaceholderTile(isFixed, index, tileBackgroundColors[index])
					)}
				</ul>
			)}

			{!isLoading && hasObjects && (
				<ul className="c-block-objects-grid__grid">
					{visibleTiles.map(({ item, isFixed }, index) =>
						renderTile(item, isFixed, tileBackgroundColors[index])
					)}
				</ul>
			)}

			{searchQuery && (
				<div className="c-block-objects-grid__footer">
					<Link to={stripDomain(searchQuery)}>
						<Button
							label={tText(
								'modules/content-page/components/blocks/block-objects-grid/block-objects-grid___toon-alle',
								undefined,
								[HET_ARCHIEF]
							)}
							ariaLabel={tText(
								'modules/content-page/components/blocks/block-objects-grid/block-objects-grid___toon-alle-objecten-voor-deze-zoekopdracht',
								undefined,
								[HET_ARCHIEF]
							)}
							variants={['block', 'black']}
						/>
					</Link>
				</div>
			)}
		</section>
	);
};
