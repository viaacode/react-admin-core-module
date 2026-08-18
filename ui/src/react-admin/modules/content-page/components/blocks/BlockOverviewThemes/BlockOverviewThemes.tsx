import clsx from 'clsx';
import type { FunctionComponent, ReactElement } from 'react';
import React, { useMemo } from 'react';
import { getThemeEntryPickerItem } from '~content-blocks/BlockOverviewThemes/BlockOverviewThemes.helpers.ts';
import type { BlockOverviewThemesProps } from '~content-blocks/BlockOverviewThemes/BlockOverviewThemes.types.ts';
import { BlockOverviewThemesGroupSection } from '~content-blocks/BlockOverviewThemes/BlockOverviewThemesGroupSection.tsx';
import { GET_SECONDARY_BACKGROUND_COLOR_OPTIONS_ARCHIEF } from '~modules/content-page/const/get-color-options';
import { useGetThemesByIds } from './hooks/useGetThemesByIds';
import './BlockOverviewThemes.scss';

export const BlockOverviewThemes: FunctionComponent<BlockOverviewThemesProps> = ({
	className,
	elements,
}): ReactElement => {
	// A picker entry is `null` while it is being cleared in the editor, and `value` is an empty
	// string for a freshly added one, so both have to be filtered out before querying.
	const themeIds = useMemo(
		() =>
			Array.from(
				new Set(
					(elements || []).flatMap((group) =>
						(group?.themes || [])
							.map((themeEntry) => getThemeEntryPickerItem(themeEntry)?.value)
							.filter((themeId): themeId is string => !!themeId)
					)
				)
			),
		[elements]
	);
	const { data: themes } = useGetThemesByIds(themeIds);
	// Fallback for groups saved before the band color became a per-group setting: cycles, since
	// there can be more groups than there are band colors
	const bandColors = GET_SECONDARY_BACKGROUND_COLOR_OPTIONS_ARCHIEF();

	return (
		<div className={clsx('c-block-overview-themes', className)}>
			{(elements || []).filter(Boolean).map((group, groupIndex) => (
				<BlockOverviewThemesGroupSection
					// biome-ignore lint/suspicious/noArrayIndexKey: groups have no stable id
					key={`c-block-overview-themes__group-${groupIndex}`}
					group={group}
					groupIndex={groupIndex}
					themes={themes || []}
					bandColor={group.bandColor || bandColors[groupIndex % bandColors.length].value}
				/>
			))}
		</div>
	);
};
