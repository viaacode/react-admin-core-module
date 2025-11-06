import { useQuery } from '@tanstack/react-query';
import { NavigationService } from '~modules/navigation/navigation.service.js';
import { QUERY_KEYS } from '~shared/types/index.js';
import { reindexNavigationItems } from '../helpers/reorder-navigation-items.js';

export const useGetNavigationBars = () => {
	return useQuery([QUERY_KEYS.GET_NAVIGATIONS], async () => {
		const navItems = await NavigationService.fetchNavigationBars();
		reindexNavigationItems(navItems);
		return navItems;
	});
};
