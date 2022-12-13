import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { NAVIGATIONS_QUERY_KEYS } from '~modules/navigation/navigation.consts';
import { NavigationService } from '~modules/navigation/navigation.service';
import { NavigationItem } from '../navigation.types';

export const useGetNavigationItem = (
	id: string | undefined,
	options?: UseQueryOptions<
		NavigationItem | null,
		any,
		NavigationItem | null,
		typeof NAVIGATIONS_QUERY_KEYS.getNavigationItem[]
	>
) => {
	return useQuery(
		[NAVIGATIONS_QUERY_KEYS.getNavigationItem],
		() => {
			if (!id) {
				return null;
			}
			return NavigationService.fetchNavigationItemById(id);
		},
		options
	);
};
