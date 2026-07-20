import clsx from 'clsx';
import { keyBy } from 'es-toolkit';
import type { FunctionComponent, ReactElement } from 'react';
import React, { useMemo } from 'react';
import type { BlockOverviewThemesProps } from '~content-blocks/BlockOverviewThemes/BlockOverviewThemes.types.tsx';
import { BlockOverviewThemesGroupSection } from '~content-blocks/BlockOverviewThemes/BlockOverviewThemesGroupSection.tsx';
import { GET_SECONDARY_BACKGROUND_COLOR_OPTIONS_ARCHIEF } from '~modules/content-page/const/get-color-options';
import { useGetThemesByIds } from './hooks/useGetThemesByIds';
import './BlockOverviewThemes.scss';

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

	return (
		<div className={clsx('c-block-overview-themes', className)}>
			{(elements || []).map((group, groupIndex) => (
				<BlockOverviewThemesGroupSection
					// biome-ignore lint/suspicious/noArrayIndexKey: groups have no stable id
					key={`c-block-overview-themes__group-${groupIndex}`}
					group={group}
					groupIndex={groupIndex}
					themesById={themesById}
					bandColor={GET_SECONDARY_BACKGROUND_COLOR_OPTIONS_ARCHIEF()[groupIndex].value}
				/>
			))}
		</div>
	);
};
