import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { NAVIGATIONS_QUERY_KEYS } from '~modules/navigation/navigation.consts';
import { NavigationService } from '~modules/navigation/navigation.service';
import { reindexNavigationItems } from '../helpers/reorder-navigation-items';
import { NavigationBar } from '../navigation.types';

export const useGetNavigationBars = (
	options?: UseQueryOptions<
		NavigationBar[],
		any,
		NavigationBar[],
		typeof NAVIGATIONS_QUERY_KEYS.getNavigations[]
	>
) => {
	return useQuery(
		[NAVIGATIONS_QUERY_KEYS.getNavigations],
		async () => {
			const navItems = await NavigationService.fetchNavigationBars();
			reindexNavigationItems(navItems);
			return navItems;
		},
		options
	);
};
