import { Image } from '@viaa/avo2-components';
import clsx from 'clsx';
import { keyBy } from 'es-toolkit';
import { stringifyUrl } from 'query-string';
import type { FunctionComponent, ReactElement } from 'react';
import React, { useMemo } from 'react';
import type { HeadingTypeOption } from '~modules/content-page/types/content-block.types';
import { Link } from '~shared/components/Link/Link';
import { ROUTE_PARTS } from '~shared/consts/routes';
import type { Theme } from '~shared/services/themes-service/themes.types';
import type { DefaultComponentProps } from '~shared/types/components';
import type { PickerItem } from '~shared/types/content-picker';
import './BlockOverviewThemes.scss';
import { type ThemeTileSpan, getThemeTileSpans } from './getThemeTileSpans';
import { useGetThemesByIds } from './hooks/useGetThemesByIds';

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

export const BlockOverviewThemes: FunctionComponent<BlockOverviewThemesProps> = ({
	className,
	elements,
}): ReactElement => {
	const themeIds = useMemo(
		() =>
			Array.from(
				new Set((elements || []).flatMap((group) => (group.themes || []).map((theme) => theme.value)))
			),
		[elements]
	);
	const { data: themes } = useGetThemesByIds(themeIds);
	const themesById = useMemo(() => keyBy(themes || [], (theme) => theme.id), [themes]);

	return (
		<div className={clsx('c-block-overview-themes', className)}>
			{(elements || []).map((group, groupIndex) => (
				<section
					// biome-ignore lint/suspicious/noArrayIndexKey: groups have no stable id
					key={`c-block-overview-themes__group-${groupIndex}`}
					className="c-block-overview-themes__group"
				>
					{group.title &&
						// Rendered as the semantic titleType tag directly (not via BlockHeading) so the
						// heading level only affects HTML semantics, never the visual style.
						React.createElement(
							group.titleType || 'h2',
							{ className: 'c-block-overview-themes__group-title' },
							group.title
						)}
					{(() => {
						const resolvedThemes = (group.themes || [])
							.map((pickerItem) => themesById[pickerItem.value])
							.filter((theme): theme is Theme => !!theme);
						const spans = getThemeTileSpans(resolvedThemes.length);

						return (
							<div className="c-block-overview-themes__grid">
								{resolvedThemes.map((theme, tileIndex) => {
									const span = spans[tileIndex];

									return (
										<Link
											// biome-ignore lint/suspicious/noArrayIndexKey: themes can be picked more than once across groups
											key={`c-block-overview-themes__tile-${groupIndex}-${tileIndex}`}
											className={clsx(
												'c-block-overview-themes__tile',
												getTileSpanClassName(span)
											)}
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
						);
					})()}
				</section>
			))}
		</div>
	);
};
