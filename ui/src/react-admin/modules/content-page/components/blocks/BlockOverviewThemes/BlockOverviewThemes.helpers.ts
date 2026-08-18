import type { PickerItem } from '~shared/types/content-picker.ts';
import type { BlockOverviewThemesThemeEntry } from './BlockOverviewThemes.types';

/**
 * Before the per-theme image override existed, a theme entry was stored as a bare content picker
 * item instead of a `{ theme, image }` object, so saved content pages can contain either shape.
 */
export const getThemeEntryPickerItem = (
	entry: BlockOverviewThemesThemeEntry | PickerItem | null
): PickerItem | null => {
	if (!entry) {
		return null;
	}
	return 'theme' in entry ? entry.theme : entry;
};

export const getThemeEntryImageOverride = (
	entry: BlockOverviewThemesThemeEntry | PickerItem | null
): string | undefined => (entry && 'image' in entry ? entry.image : undefined);

export const getThemeEntryDescriptionOverride = (
	entry: BlockOverviewThemesThemeEntry | PickerItem | null
): string | undefined => (entry && 'description' in entry ? entry.description : undefined);
