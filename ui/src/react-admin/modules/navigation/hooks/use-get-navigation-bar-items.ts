import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { NavigationService } from '~modules/navigation/navigation.service';
import { LanguageCode } from '~modules/translations/translations.core.types';
import { reindexNavigationItems } from '../helpers/reorder-navigation-items';
import { NavigationItem } from '../navigation.types';
import { QUERY_KEYS } from '~shared/types';
import { compact } from 'lodash-es';

export const useGetNavigationBarItems = (
	placement?: string,
	language?: LanguageCode,
	searchTerm?: string,
	options?: UseQueryOptions<NavigationItem[], any, NavigationItem[], string[]>
) => {
	return useQuery(
		compact([QUERY_KEYS.GET_NAVIGATION_BAR_ITEMS, placement, language, searchTerm]),
		async () => {
			if (!placement) {
				return [];
			}
			const navItems = await NavigationService.fetchNavigationBarItems(
				placement,
				language,
				searchTerm
			);
			reindexNavigationItems(navItems);
			return navItems;
		},
		options
	);
};
