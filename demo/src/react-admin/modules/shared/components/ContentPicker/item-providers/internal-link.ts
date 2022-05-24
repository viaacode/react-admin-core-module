import { compact, sortBy } from 'lodash-es';

import { parsePickerItem } from '../helpers/parse-picker';

import { ContentPickerType } from '~modules/shared/components/ContentPicker/ContentPicker.types';
import { PickerItem } from '~modules/shared/types/content-picker';
import { Config } from '~core/config';

// Return InternalLinkItems items from adminCoreConfig.staticPages
export const retrieveInternalLinks = async (
	keyword: string | null,
	limit: number
): Promise<PickerItem[]> => {
	const staticRoutes = Config.getConfig().staticPages;
	const routeOptions: (PickerItem | null)[] = staticRoutes.map(
		(staticRoute): PickerItem | null => {
			if (!keyword || staticRoute.includes(keyword)) {
				return {
					label: staticRoute,
					...parsePickerItem(ContentPickerType.INTERNAL_LINK, staticRoute),
				};
			}
			return null;
		}
	);
	return sortBy(compact(routeOptions), 'value').slice(0, limit);
};
