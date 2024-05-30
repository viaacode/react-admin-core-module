import { compact, sortBy } from 'lodash-es';
import { AdminConfigManager } from '~core/config';

import { PickerItem } from '~shared/types/content-picker';

import { parsePickerItem } from '../helpers/parse-picker';

// Return InternalLinkItems items from adminCoreConfig.staticPages
export const retrieveInternalLinks = async (
	keyword: string | null,
	limit: number
): Promise<PickerItem[]> => {
	const staticRoutes =
		AdminConfigManager.getConfig().staticPages[AdminConfigManager.getConfig().locale];
	const routeOptions: (PickerItem | null)[] = staticRoutes.map(
		(staticRoute): PickerItem | null => {
			if (!keyword || staticRoute.includes(keyword)) {
				return {
					label: staticRoute,
					...parsePickerItem('INTERNAL_LINK', staticRoute),
				};
			}
			return null;
		}
	);
	return sortBy(compact(routeOptions), 'value').slice(0, limit);
};
