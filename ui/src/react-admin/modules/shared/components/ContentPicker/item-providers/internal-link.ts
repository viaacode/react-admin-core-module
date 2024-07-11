import { compact, sortBy } from 'lodash-es';
import { AdminConfigManager } from '~core/config';
import { Locale } from '~modules/translations/translations.core.types';

import { PickerItem } from '~shared/types/content-picker';

import { parsePickerItem } from '../helpers/parse-picker';

// Return InternalLinkItems items from adminCoreConfig.staticPages
export const retrieveInternalLinks = async (
	keyword: string | null,
	limit: number
): Promise<PickerItem[]> => {
	const staticRoutes: [Locale, string][] = Object.keys(AdminConfigManager.getConfig().staticPages)
		.flatMap((language): [Locale, string][] => {
			const routes = AdminConfigManager.getConfig().staticPages[language as Locale];
			return (routes || []).map((route: string) => [language, route] as [Locale, string]);
		})
		.filter((route) => !route[1].includes(':'));
	const routeOptions: (PickerItem | null)[] = staticRoutes.map(
		(staticRoute): PickerItem | null => {
			const label = staticRoute[0] + ' - ' + staticRoute[1];
			if (!keyword || label.toLowerCase().includes(keyword.toLowerCase())) {
				return {
					label,
					...parsePickerItem('INTERNAL_LINK', staticRoute[1]),
				};
			}
			return null;
		}
	);
	return sortBy(compact(routeOptions), 'value').slice(0, limit);
};
