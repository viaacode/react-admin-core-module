import { Image, LinkTarget } from '@viaa/avo2-components';
import clsx from 'clsx';
import React, {
	type CSSProperties,
	type FunctionComponent,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	getThemeEntryDescriptionOverride,
	getThemeEntryImageOverride,
	getThemeEntryPickerItem,
} from '~content-blocks/BlockOverviewThemes/BlockOverviewThemes.helpers.ts';
import type {
	BlockOverviewThemesGroupSectionProps,
	BlockOverviewThemesResolvedTheme,
} from '~content-blocks/BlockOverviewThemes/BlockOverviewThemes.types.ts';
import { getThemeTileSpans, type ThemeTileSpan } from './getThemeTileSpans';
import './BlockOverviewThemes.scss';
import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import { keyBy } from 'es-toolkit/compat';
import { BlockHeading } from '~content-blocks/BlockHeading';
import { AdminConfigManager } from '~core/config';
import { getBackgroundTextColorVariables } from '~modules/content-page/const/background-text-colors';
import { AdminCoreIconName } from '~core/config/config.types';
import { Locale } from '~modules/translations/translations.core.types.ts';
import { Icon } from '~shared/components/Icon/Icon.tsx';
import { SmartLink } from '~shared/components/SmartLink/SmartLink.tsx';

/**
 * Renders a single theme group with a full-bleed colored band behind the title and first grid
 * row. Since a "tall" tile can genuinely span from row 1 into row 2, the grid can't be split into
 * separate "row 1" and "rest" DOM trees without breaking that span, so the band's height is
 * measured from the actual rendered layout instead of hardcoded.
 */
export const BlockOverviewThemesGroupSection: FunctionComponent<
	BlockOverviewThemesGroupSectionProps
> = ({ group, groupIndex, themes, bandColor }) => {
	const gridRef = useRef<HTMLDivElement>(null);
	const [bandHeight, setBandHeight] = useState<number | null>(null);
	// The group title sits on the band, so it takes the design text colors for the band color.
	// https://meemoo.atlassian.net/browse/ARC-3848
	const bandTextColorVariables = getBackgroundTextColorVariables(bandColor);

	useLayoutEffect(() => {
		const gridEl = gridRef.current;
		if (!gridEl) {
			return;
		}

		const measure = () => {
			const firstRowHeight = Number.parseFloat(
				getComputedStyle(gridEl).gridTemplateRows.split(' ')[0] || '0'
			);
			setBandHeight(firstRowHeight ? gridEl.offsetTop + firstRowHeight : null);
		};

		measure();
		const resizeObserver = new ResizeObserver(measure);
		resizeObserver.observe(gridEl);
		return () => resizeObserver.disconnect();
	}, []);

	// Only 4 combinations occur (see getThemeTileSpans): 1x1 needs no modifier, the rest map to a
	// fixed CSS class since `Link` (an app-provided router link) doesn't accept an inline `style`.
	const getTileSpanClassName = (span: ThemeTileSpan): string | undefined => {
		if (span.colSpan === 1 && span.rowSpan === 2) {
			return 'c-block-overview-themes__tile--tall';
		}
		if (span.colSpan === 2 && span.rowSpan === 1) {
			return 'c-block-overview-themes__tile--wide';
		}
		if (span.colSpan === 3 && span.rowSpan === 1) {
			return 'c-block-overview-themes__tile--full-width';
		}
		return undefined;
	};

	const themesById = useMemo(() => keyBy(themes, (theme) => theme.id), [themes]);
	// A picker entry can be `null` (while being cleared in the editor) or point at a theme that no
	// longer exists, so only the ones that actually resolve are rendered.
	const resolvedThemes: BlockOverviewThemesResolvedTheme[] = (group.themes || [])
		.map((themeEntry): BlockOverviewThemesResolvedTheme | undefined => {
			const pickerItem = getThemeEntryPickerItem(themeEntry);
			const theme = pickerItem?.value ? themesById[pickerItem.value] : undefined;
			return theme
				? // The editor can override the image and description that are configured on the theme itself
					{
						theme,
						imageUrl: getThemeEntryImageOverride(themeEntry) || theme.imageUrl || '',
						description: getThemeEntryDescriptionOverride(themeEntry),
					}
				: undefined;
		})
		.filter((resolvedTheme): resolvedTheme is BlockOverviewThemesResolvedTheme => !!resolvedTheme);
	// Groups saved before the "achtergrond vormen" field existed have no `shapesVariant`, so those
	// keep the old behaviour of cycling through the 3 arrangements by group index.
	const shapesVariantIndex = group.shapesVariant
		? Number.parseInt(group.shapesVariant, 10) - 1
		: groupIndex % 3;
	const spans = getThemeTileSpans(resolvedThemes.length);

	/**
	 * Renders the white meemoo logo shapes in the colors bands behind the theme group title and first row
	 * @param variantIndex zero based index of the shape arrangement to render
	 */
	const renderGroupShapes = (variantIndex: number) => {
		const rectangleStyles: CSSProperties = { width: '6cqw' };
		const circleStyles: CSSProperties = { borderRadius: '50%' };
		const shapeStyles: [CSSProperties, CSSProperties][] = [
			[circleStyles, rectangleStyles],
			[rectangleStyles, circleStyles],
			[rectangleStyles, rectangleStyles],
		];
		const positionStyles: [CSSProperties, CSSProperties][] = [
			[
				// Circle
				{ right: '5%', top: '6rem' },
				// Rectangle
				{ right: '25%', top: '3rem', transform: 'rotate(35deg)' },
			],
			[
				// Rectangle
				{ right: '0%', top: '5rem', transform: 'rotate(-45deg)' },
				// Circle
				{ right: '25%', top: '6rem' },
			],
			[
				// Rectangle
				{ right: '30%', top: '1rem', transform: 'rotate(85deg)' },
				// Rectangle
				{ right: '45%', top: '-4rem', transform: 'rotate(20deg)' },
			],
		];
		return (
			<>
				<div
					className="c-block-overview-themes__group-shape"
					style={{ ...shapeStyles[variantIndex][0], ...positionStyles[variantIndex][0] }}
				/>
				<div
					className="c-block-overview-themes__group-shape"
					style={{ ...shapeStyles[variantIndex][1], ...positionStyles[variantIndex][1] }}
				/>
			</>
		);
	};

	return (
		<section
			className="c-block-overview-themes__group"
			style={bandTextColorVariables as CSSProperties}
		>
			{!!bandHeight && (
				<>
					<div
						className="c-block-overview-themes__group-band"
						style={{ height: `${bandHeight}px`, backgroundColor: bandColor }}
					/>
					{renderGroupShapes(shapesVariantIndex)}
				</>
			)}
			{group.title && (
				<BlockHeading
					type={group.titleType || 'h2'}
					className="c-block-overview-themes__group-title"
				>
					{group.title}
				</BlockHeading>
			)}
			<div ref={gridRef} className="c-block-overview-themes__grid">
				{resolvedThemes.map(({ theme, imageUrl, description }, tileIndex) => {
					const span = spans[tileIndex];
					const locale = AdminConfigManager.getConfig().locale || Locale.Nl;
					const themeNameLocale = (locale === Locale.Nl ? theme.nameNl : theme.nameEn) || '';
					const themeDescriptionLocale =
						(locale === Locale.Nl ? theme.descriptionNl : theme.descriptionEn) || '';
					const tileDescription = description || themeDescriptionLocale || undefined;
					// Themes without a content page for the current locale have nothing to link to.
					const contentPagePath =
						locale === Locale.Nl ? theme.contentPagePathNl : theme.contentPagePathEn;
					const tileClassName = clsx('c-block-overview-themes__tile', getTileSpanClassName(span));
					const tileContent = (
						<>
							<Image
								src={imageUrl}
								alt={themeNameLocale}
								className="c-block-overview-themes__tile-image"
							/>
							<div className="c-block-overview-themes__tile-content">
								<div className="c-block-overview-themes__tile-text">
									<span className="c-block-overview-themes__tile-title">{themeNameLocale}</span>
									{!!tileDescription && (
										<p className="c-block-overview-themes__tile-description">{tileDescription}</p>
									)}
								</div>
								{!!contentPagePath && (
									<Icon
										className="c-block-overview-themes__tile-title__icon"
										name={AdminCoreIconName.ArrowDownRight}
									/>
								)}
							</div>
						</>
					);

					if (!contentPagePath) {
						return (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: themes can be picked more than once across groups
								key={`c-block-overview-themes__tile-${groupIndex}-${tileIndex}`}
								className={tileClassName}
							>
								{tileContent}
							</div>
						);
					}

					return (
						<SmartLink
							// biome-ignore lint/suspicious/noArrayIndexKey: themes can be picked more than once across groups
							key={`c-block-overview-themes__tile-${groupIndex}-${tileIndex}`}
							className={tileClassName}
							action={{
								value: contentPagePath,
								type: AvoCoreContentPickerType.CONTENT_PAGE,
								target: LinkTarget.Self,
							}}
						>
							{tileContent}
						</SmartLink>
					);
				})}
			</div>
		</section>
	);
};
