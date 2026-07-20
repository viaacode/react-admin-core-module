import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import memoize from 'memoizee';
import { MEMOIZEE_OPTIONS } from '~shared/consts/memoizee-options';
import { CustomError } from '~shared/helpers/custom-error';
import { ThemesService } from '~shared/services/themes-service/themes.service';
import type { Theme } from '~shared/services/themes-service/themes.types';
import type { PickerItem } from '~shared/types/content-picker';
import { parsePickerItem } from '../helpers/parse-picker';

export const retrieveThemes = memoize(
	async (titleOrId: string | null, limit = 5): Promise<PickerItem[]> => {
		try {
			const response = await ThemesService.fetchThemes(titleOrId, 0, limit);
			return parseThemes(response.items || []);
		} catch (err) {
			throw new CustomError('Failed to fetch themes for content picker', err, {
				titleOrId,
				limit,
			});
		}
	},
	MEMOIZEE_OPTIONS
);

const parseThemes = (raw: Theme[]): PickerItem[] => {
	return raw.map(
		(theme: Theme): PickerItem => ({
			label: theme.nameNl,
			...parsePickerItem(AvoCoreContentPickerType.IE_OBJECT_THEME, theme.id),
		})
	);
};
