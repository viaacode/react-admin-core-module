import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { NavigationService } from '~modules/navigation/navigation.service';
import { reindexNavigationItems } from '../helpers/reorder-navigation-items';
import type { NavigationBar } from '../navigation.types';
import { QUERY_KEYS } from '~shared/types';

export const useGetNavigationBars = (
	options?: UseQueryOptions<NavigationBar[], any, NavigationBar[], QUERY_KEYS[]>
) => {
	return useQuery(
		[QUERY_KEYS.GET_NAVIGATIONS],
		async () => {
			const navItems = await NavigationService.fetchNavigationBars();
			reindexNavigationItems(navItems);
			return navItems;
		},
		options
	);
};
