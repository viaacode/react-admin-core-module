import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { NavigationService } from '~modules/navigation/navigation.service';
import { reindexNavigationItems } from '../helpers/reorder-navigation-items';
import { NavigationItem } from '../navigation.types';
import { QUERY_KEYS } from '~shared/types';

export const useGetNavigationBarItems = (
	placement?: string,
	options?: UseQueryOptions<NavigationItem[], any, NavigationItem[], QUERY_KEYS[]>
) => {
	return useQuery(
		[QUERY_KEYS.GET_NAVIGATION_BAR_ITEMS],
		async () => {
			if (!placement) {
				return [];
			}
			const navItems = await NavigationService.fetchNavigationBarItems(placement);
			reindexNavigationItems(navItems);
			return navItems;
		},
		options
	);
};
