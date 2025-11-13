import { useQuery } from '@tanstack/react-query';
import { NavigationService } from '~modules/navigation/navigation.service';
import { QUERY_KEYS } from '~shared/types/index';
import { reindexNavigationItems } from '../helpers/reorder-navigation-items';

export const useGetNavigationBars = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_NAVIGATIONS],
		queryFn: async () => {
			const navItems = await NavigationService.fetchNavigationBars();
			reindexNavigationItems(navItems);
			return navItems;
		},
	});
};
