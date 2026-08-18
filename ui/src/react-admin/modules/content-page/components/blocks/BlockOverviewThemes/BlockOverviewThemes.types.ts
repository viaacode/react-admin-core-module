import type { HeadingTypeOption } from '~modules/content-page/types/content-block.types.ts';
import type { Theme } from '~modules/shared/services/themes-service/themes.types';
import type { DefaultComponentProps } from '~shared/types';
import type { PickerItem } from '~shared/types/content-picker.ts';

/**
 * Which of the 3 hardcoded white meemoo shape arrangements is drawn in the group's color band.
 * See `renderGroupShapes` in BlockOverviewThemesGroupSection.tsx.
 */
export type BlockOverviewThemesShapesVariant = '1' | '2' | '3';

export interface BlockOverviewThemesThemeEntry {
	// The content picker reports `null` for an entry that is being cleared, so a saved group can
	// contain empty slots
	theme: PickerItem | null;
	// Optional upload that overrides the image configured on the theme itself
	image?: string;
}

export interface BlockOverviewThemesGroup {
	title: string;
	titleType: HeadingTypeOption;
	bandColor: string;
	shapesVariant?: BlockOverviewThemesShapesVariant;
	themes: BlockOverviewThemesThemeEntry[];
}

export interface BlockOverviewThemesProps extends DefaultComponentProps, BlockOverviewThemesGroup {}

export interface BlockOverviewThemesResolvedTheme {
	theme: Theme;
	imageUrl: string;
}

export interface BlockOverviewThemesGroupSectionProps {
	group: BlockOverviewThemesGroup;
	groupIndex: number;
	themes: Theme[];
	bandColor: string;
}
