import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { NavigationService } from '~modules/navigation/navigation.service';
import { reindexNavigationItems } from '../helpers/reorder-navigation-items';
import { NavigationBar } from '../navigation.types';
import { QUERY_KEYS } from '~modules/shared/types';

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
