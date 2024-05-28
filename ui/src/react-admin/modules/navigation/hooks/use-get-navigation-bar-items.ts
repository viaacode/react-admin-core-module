import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { NavigationService } from '~modules/navigation/navigation.service';
import { Locale } from '~modules/translations/translations.core.types';
import { reindexNavigationItems } from '../helpers/reorder-navigation-items';
import { NavigationItem } from '../navigation.types';
import { QUERY_KEYS } from '~shared/types';
import { compact } from 'lodash-es';

export const useGetNavigationBarItems = (
	placement?: string,
	languages?: Locale[],
	searchTerm?: string,
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
				searchTerm
			);
			reindexNavigationItems(navItems);
			return navItems;
		},
		options
	);
};
