import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { NavigationService } from '~modules/navigation/navigation.service';
import { NavigationItem } from '../navigation.types';
import { QUERY_KEYS } from '~modules/shared/types';

export const useGetNavigationItem = (
	id: string | undefined,
	options?: UseQueryOptions<NavigationItem | null, any, NavigationItem | null, QUERY_KEYS[]>
) => {
	return useQuery(
		[QUERY_KEYS.GET_NAVIGATION_ITEM],
		() => {
			if (!id) {
				return null;
			}
			return NavigationService.fetchNavigationItemById(id);
		},
		options
	);
};
