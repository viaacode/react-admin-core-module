import { Image } from '@viaa/avo2-components';
import clsx from 'clsx';
import { keyBy } from 'es-toolkit';
import { stringifyUrl } from 'query-string';
import type { CSSProperties, FunctionComponent, ReactElement } from 'react';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { GET_SECONDARY_BACKGROUND_COLOR_OPTIONS_ARCHIEF } from '~modules/content-page/const/get-color-options';
import type { HeadingTypeOption } from '~modules/content-page/types/content-block.types';
import { Link } from '~shared/components/Link/Link';
import { ROUTE_PARTS } from '~shared/consts/routes';
import type { Theme } from '~shared/services/themes-service/themes.types';
import type { DefaultComponentProps } from '~shared/types/components';
import type { PickerItem } from '~shared/types/content-picker';
import './BlockOverviewThemes.scss';
import { getThemeTileSpans, type ThemeTileSpan } from './getThemeTileSpans';
import { useGetThemesByIds } from './hooks/useGetThemesByIds';

// Assigns one color per group without repeating any color until the whole palette has been used
// once ("shuffle bag"): pick a random color from the remaining pool, remove it, and refill the
// pool with the full palette again once it runs out.
const assignBandColors = (groupCount: number): string[] => {
	const palette = GET_SECONDARY_BACKGROUND_COLOR_OPTIONS_ARCHIEF().map(
		(option) => option.value as string
	);
	const colors: string[] = [];
	let pool: string[] = [];

	for (let i = 0; i < groupCount; i++) {
		if (pool.length === 0) {
			pool = [...palette];
		}
		const index = Math.floor(Math.random() * pool.length);
		colors.push(pool[index]);
		pool.splice(index, 1);
	}

	return colors;
};

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

export interface BlockOverviewThemesGroup {
	title: string;
	titleType: HeadingTypeOption;
	themes: PickerItem[];
}

export interface BlockOverviewThemesProps extends DefaultComponentProps {
	elements: BlockOverviewThemesGroup[];
}

interface BlockOverviewThemesGroupSectionProps {
	group: BlockOverviewThemesGroup;
	groupIndex: number;
	themesById: Record<string, Theme>;
	bandColor: string;
}

/**
 * Renders a single theme group with a full-bleed colored band behind the title and first grid
 * row. Since a "tall" tile can genuinely span from row 1 into row 2, the grid can't be split into
 * separate "row 1" and "rest" DOM trees without breaking that span, so the band's height is
 * measured from the actual rendered layout instead of hardcoded.
 */
const BlockOverviewThemesGroupSection: FunctionComponent<BlockOverviewThemesGroupSectionProps> = ({
	group,
	groupIndex,
	themesById,
	bandColor,
}) => {
	const gridRef = useRef<HTMLDivElement>(null);
	const [bandHeight, setBandHeight] = useState<number | null>(null);

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

	const resolvedThemes = (group.themes || [])
		.map((pickerItem) => themesById[pickerItem.value])
		.filter((theme): theme is Theme => !!theme);
	const spans = getThemeTileSpans(resolvedThemes.length);

	/**
	 * Renders the white meemoo logo shapes in the colors bands behind the theme group title and first row
	 * @param groupIndex
	 */
	const renderGroupShapes = (groupIndex: number) => {
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
					style={{ ...shapeStyles[groupIndex % 3][0], ...positionStyles[groupIndex % 3][0] }}
				></div>
				<div
					className="c-block-overview-themes__group-shape"
					style={{ ...shapeStyles[groupIndex % 3][1], ...positionStyles[groupIndex % 3][1] }}
				></div>
			</>
		);
	};

	return (
		<section className="c-block-overview-themes__group">
			{!!bandHeight && (
				<>
					<div
						className="c-block-overview-themes__group-band"
						style={{ height: `${bandHeight}px`, backgroundColor: bandColor }}
					/>
					{renderGroupShapes(groupIndex)}
				</>
			)}
			{group.title &&
				// Rendered as the semantic titleType tag directly (not via BlockHeading) so the
				// heading level only affects HTML semantics, never the visual style.
				React.createElement(
					group.titleType || 'h2',
					{ className: 'c-block-overview-themes__group-title' },
					group.title
				)}
			<div ref={gridRef} className="c-block-overview-themes__grid">
				{resolvedThemes.map((theme, tileIndex) => {
					const span = spans[tileIndex];

					return (
						<Link
							// biome-ignore lint/suspicious/noArrayIndexKey: themes can be picked more than once across groups
							key={`c-block-overview-themes__tile-${groupIndex}-${tileIndex}`}
							className={clsx('c-block-overview-themes__tile', getTileSpanClassName(span))}
							to={stringifyUrl({
								url: `/${ROUTE_PARTS.search}`,
								query: { theme: theme.slug },
							})}
						>
							<Image
								src={theme.imageUrl || ''}
								alt={theme.nameNl}
								className="c-block-overview-themes__tile-image"
							/>
							<span className="c-block-overview-themes__tile-title">{theme.nameNl}</span>
						</Link>
					);
				})}
			</div>
		</section>
	);
};

export const BlockOverviewThemes: FunctionComponent<BlockOverviewThemesProps> = ({
	className,
	elements,
}): ReactElement => {
	const themeIds = useMemo(
		() =>
			Array.from(
				new Set(
					(elements || []).flatMap((group) => (group.themes || []).map((theme) => theme.value))
				)
			),
		[elements]
	);
	const { data: themes } = useGetThemesByIds(themeIds);
	const themesById = useMemo(() => keyBy(themes || [], (theme) => theme.id), [themes]);
	const bandColors = useMemo(() => assignBandColors((elements || []).length), [elements]);

	return (
		<div className={clsx('c-block-overview-themes', className)}>
			{(elements || []).map((group, groupIndex) => (
				<BlockOverviewThemesGroupSection
					// biome-ignore lint/suspicious/noArrayIndexKey: groups have no stable id
					key={`c-block-overview-themes__group-${groupIndex}`}
					group={group}
					groupIndex={groupIndex}
					themesById={themesById}
					bandColor={bandColors[groupIndex]}
				/>
			))}
		</div>
	);
};
