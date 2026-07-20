import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import clsx from 'clsx';
import type { ComponentProps, FunctionComponent, ReactElement } from 'react';
import { BlockHeading } from '~content-blocks/BlockHeading';
import { SmartLink } from '~modules/shared/components/SmartLink/SmartLink';
import { Icon } from '~shared/components/Icon';
import { tText } from '~shared/helpers/translation-functions';
import { HET_ARCHIEF } from '~shared/types';
import './BlockObjectsGrid.scss';
import {
	type BlockObjectsGridProps,
	type ObjectsGridItem,
	ObjectsGridItemType,
} from './BlockObjectsGrid.types';
import { useGetObjectsGridItems } from './hooks/useGetObjectsGridItems';

// NOTE (client route): ie-object detail pages live under this path on hetarchief.be. Adjust
// the prefix if the client application uses a different detail route for objects.
const OBJECT_DETAIL_PATH_PREFIX = '/pid';

// 4 rows of 4 items per row when there are no fixed items present
// https://meemoo.atlassian.net/wiki/spaces/HA2/pages/6217171023/FA+Objecten+grid#Gedrag-van-het-contentblok
const OBJECT_GRID_MAX_ITEMS = 16;

const getObjectDetailPath = (schemaIdentifier: string): string =>
	`${OBJECT_DETAIL_PATH_PREFIX}/${encodeURIComponent(schemaIdentifier)}`;

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

type IconNameType = ComponentProps<typeof Icon>['name'];

// Object type → icon name (icons are registered in the admin-core icon config). Types without a
// dedicated icon (e.g. image) simply render no type-icon.
const TYPE_ICON_NAME: Partial<Record<ObjectsGridItemType, IconNameType>> = {
	[ObjectsGridItemType.Video]: 'video',
	[ObjectsGridItemType.Audio]: 'audio',
	[ObjectsGridItemType.Newspaper]: 'newspaper',
};

export const BlockObjectsGrid: FunctionComponent<BlockObjectsGridProps> = ({
	className,
	title,
	titleType = 'h2',
	searchQuery,
	elements = [],
	backgroundColor,
}): ReactElement => {
	const fixedItems = elements.map((element) => element.mediaItem).filter((item) => item?.value);
	// Items to fetch is: max - 2 * fixed items, because fixed items are double width
	const { data, isLoading, isError } = useGetObjectsGridItems(
		searchQuery,
		fixedItems,
		OBJECT_GRID_MAX_ITEMS - fixedItems.length * 2
	);

	const renderTile = (item: ObjectsGridItem, isFixed: boolean): ReactElement => {
		const iconName = item.type ? TYPE_ICON_NAME[item.type] : undefined;
		const isAudio = item.type === ObjectsGridItemType.Audio;

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
						value: getObjectDetailPath(item.schemaIdentifier),
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
						className={clsx('c-block-objects-grid__tile-media', {
							'c-block-objects-grid__tile-media--audio': isAudio,
						})}
					>
						{item.thumbnailUrl ? (
							<img className="c-block-objects-grid__tile-image" src={item.thumbnailUrl} alt="" />
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
	const orderedTiles: { item: ObjectsGridItem; isFixed: boolean }[] = [
		...(firstFixed ? [{ item: firstFixed, isFixed: true }] : []),
		...objects.slice(0, 2).map((item) => ({ item, isFixed: false })),
		...restFixed.map((item) => ({ item, isFixed: true })),
		...objects.slice(2).map((item) => ({ item, isFixed: false })),
	];
	const hasObjects = orderedTiles.length > 0;

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
					{orderedTiles.map(({ item, isFixed }) => renderTile(item, isFixed))}
				</ul>
			)}

			{searchQuery && (
				<div className="c-block-objects-grid__footer">
					<SmartLink
						action={{
							type: AvoCoreContentPickerType.EXTERNAL_LINK,
							value: stripDomain(searchQuery),
						}}
						removeStyles={false}
						className="c-block-objects-grid__cta"
						ariaLabel={tText(
							'modules/content-page/components/blocks/block-objects-grid/block-objects-grid___toon-alle-objecten-voor-deze-zoekopdracht',
							undefined,
							[HET_ARCHIEF]
						)}
					>
						{tText(
							'modules/content-page/components/blocks/block-objects-grid/block-objects-grid___toon-alle',
							undefined,
							[HET_ARCHIEF]
						)}
					</SmartLink>
				</div>
			)}
		</section>
	);
};
