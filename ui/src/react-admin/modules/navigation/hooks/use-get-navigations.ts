import { HTTPError } from 'ky';
import { useQuery, UseQueryOptions } from 'react-query';
import { NAVIGATIONS_QUERY_KEYS } from '~modules/navigation/navigation.consts';
import { NavigationService } from '~modules/navigation/navigation.service';
import { reindexNavigationItems } from '../helpers/reorder-navigation-items';
import { NavigationItem } from '../navigation.types';

export const useGetNavigations = (
	placement?: string,
	options?: UseQueryOptions<
		NavigationItem[],
		HTTPError,
		NavigationItem[],
		typeof NAVIGATIONS_QUERY_KEYS.getNavigations
	>
) => {
	return useQuery(
		NAVIGATIONS_QUERY_KEYS.getNavigations,
		async () => {
			const navItems = await NavigationService.fetchNavigationItems(placement);
			reindexNavigationItems(navItems);
			return navItems;
		},
		options
	);
};