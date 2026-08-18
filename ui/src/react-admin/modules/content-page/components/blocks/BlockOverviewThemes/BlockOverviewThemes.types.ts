import type { HeadingTypeOption } from '~modules/content-page/types/content-block.types.ts';
import type { Theme } from '~modules/shared/services/themes-service/themes.types';
import type { DefaultComponentProps } from '~shared/types';
import type { PickerItem } from '~shared/types/content-picker.ts';

export interface BlockOverviewThemesGroup {
	title: string;
	titleType: HeadingTypeOption;
	// The content picker reports `null` for an entry that is being cleared, so a saved group can
	// contain empty slots
	themes: (PickerItem | null)[];
}

export interface BlockOverviewThemesProps extends DefaultComponentProps {
	elements: BlockOverviewThemesGroup[];
}

export interface BlockOverviewThemesGroupSectionProps {
	group: BlockOverviewThemesGroup;
	groupIndex: number;
	themes: Theme[];
	bandColor: string;
}
