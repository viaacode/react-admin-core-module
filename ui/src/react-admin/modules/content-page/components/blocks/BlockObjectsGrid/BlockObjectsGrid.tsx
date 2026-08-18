import { Button } from '@meemoo/react-components';
import type { IconName } from '@viaa/avo2-components';
import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import clsx from 'clsx';
import type { FunctionComponent, ReactElement, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { BlockHeading } from '~content-blocks/BlockHeading';
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
		return 2;
	};

	// Packs tiles into rows the same way the CSS grid renders them (auto-flow row, not dense):
	// a fixed (2-column-wide) tile that doesn't fit the remaining space in a row wraps to the
	// next row, leaving the remainder of the current row empty.
	const packTilesIntoRows = (tiles: OrderedTile[], columns: number): OrderedTile[][] => {
		const rows: OrderedTile[][] = [];
		let currentRow: OrderedTile[] = [];
		let usedColumns = 0;

		tiles.forEach((tile) => {
			const width = tile.isFixed ? 2 : 1;
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
	const getVisibleTiles = (tiles: OrderedTile[], columns: number): OrderedTile[] => {
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

	const renderTile = (item: ObjectsGridItem, isFixed: boolean): ReactElement => {
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
							<img className={'c-block-objects-grid__tile-image'} src={item.thumbnailUrl} alt="" />
						) : (
							// No thumbnail (e.g. audio): decorative placeholder, the link already carries the name.
							<span className="c-block-objects-grid__tile-placeholder" aria-hidden="true">
								{iconName && <Icon name={iconName as IconName} />}
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
						{iconName && (
							<Icon className="c-block-objects-grid__tile-type-icon" name={iconName as IconName} />
						)}
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
	const orderedTiles: { item: ObjectsGridItem; isFixed: boolean }[] = [
		...(firstFixed ? [{ item: firstFixed, isFixed: true }] : []),
		...objects.slice(0, 2).map((item) => ({ item, isFixed: false })),
		...restFixed.map((item) => ({ item, isFixed: true })),
		...objects.slice(2).map((item) => ({ item, isFixed: false })),
	];

	const columns = getColumnsForWidth(windowWidth);
	const visibleTiles = getVisibleTiles(orderedTiles, columns);
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

			{hasObjects && (
				<ul className="c-block-objects-grid__grid">
					{visibleTiles.map(({ item, isFixed }) => renderTile(item, isFixed))}
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
