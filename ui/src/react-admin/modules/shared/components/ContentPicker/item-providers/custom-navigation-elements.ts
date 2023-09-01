import { compact, sortBy } from 'lodash-es';

import { parsePickerItem } from '../helpers/parse-picker';

import { PickerItem } from '~shared/types/content-picker';
import { AdminConfigManager } from '~core/config';

// Return custom navigation elements from adminCoreConfig.navigationBars.customNavigationElements
export const retrieveCustomNavigationElements = async (
	keyword: string | null,
	limit: number
): Promise<PickerItem[]> => {
	const customNavigationElements =
		AdminConfigManager.getConfig().navigationBars?.customNavigationElements || [];
	const customNavigationOptions: (PickerItem | null)[] = customNavigationElements.map(
		(customNavigationElement): PickerItem | null => {
			if (!keyword || customNavigationElement.includes(keyword)) {
				return {
					label: customNavigationElement,
					...parsePickerItem('CUSTOM_NAVIGATION_ELEMENTS', customNavigationElement),
				};
			}
			return null;
		}
	);
	return sortBy(compact(customNavigationOptions), 'value').slice(0, limit);
};
