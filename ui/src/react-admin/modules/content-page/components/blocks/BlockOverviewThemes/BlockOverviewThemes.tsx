import clsx from 'clsx';
import type { FunctionComponent, ReactElement } from 'react';
import React, { useMemo } from 'react';
import { getThemeEntryPickerItem } from '~content-blocks/BlockOverviewThemes/BlockOverviewThemes.helpers.ts';
import type { BlockOverviewThemesProps } from '~content-blocks/BlockOverviewThemes/BlockOverviewThemes.types.ts';
import { BlockOverviewThemesGroupSection } from '~content-blocks/BlockOverviewThemes/BlockOverviewThemesGroupSection.tsx';
import { useGetThemesByIds } from './hooks/useGetThemesByIds';
import './BlockOverviewThemes.scss';

export const BlockOverviewThemes: FunctionComponent<BlockOverviewThemesProps> = ({
	className,
	title,
	titleType,
	bandColor,
	shapesVariant,
	themes: themeEntries,
}): ReactElement => {
	// A picker entry is `null` while it is being cleared in the editor, and `value` is an empty
	// string for a freshly added one, so both have to be filtered out before querying.
	const themeIds = useMemo(
		() =>
			Array.from(
				new Set(
					(themeEntries || [])
						.map((themeEntry) => getThemeEntryPickerItem(themeEntry)?.value)
						.filter((themeId): themeId is string => !!themeId)
				)
			),
		[themeEntries]
	);
	const { data: themes } = useGetThemesByIds(themeIds);
	return (
		<div className={clsx('c-block-overview-themes', className)}>
			<BlockOverviewThemesGroupSection
				group={{ title, titleType, bandColor, shapesVariant, themes: themeEntries }}
				groupIndex={0}
				themes={themes || []}
				bandColor={bandColor}
			/>
		</div>
	);
};
