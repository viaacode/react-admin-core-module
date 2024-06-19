import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { compact } from 'lodash-es';
import { NavigationService } from '~modules/navigation/navigation.service';
import { Locale } from '~modules/translations/translations.core.types';
import { QUERY_KEYS } from '~shared/types';
import { reindexNavigationItems } from '../helpers/reorder-navigation-items';
import { NavigationItem } from '../navigation.types';

export const useGetNavigationBarItems = (
	placement?: string,
	languages?: Locale[],
	searchTerm?: string,
	orderProperty?: string,
	orderDirection?: string,
	options?: UseQueryOptions<NavigationItem[], any, NavigationItem[], string[]>
) => {
	return useQuery(
		compact([
			QUERY_KEYS.GET_NAVIGATION_BAR_ITEMS,
			placement,
			(languages || []).join(','),
			searchTerm,
		]),
		async () => {
			if (!placement) {
				return [];
			}
			const navItems = await NavigationService.fetchNavigationBarItems(
				placement,
				languages,
				searchTerm,
				orderProperty,
				orderDirection
			);
			reindexNavigationItems(navItems);
			return navItems;
		},
		options
	);
};
