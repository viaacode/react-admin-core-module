import { HTTPError } from 'ky';
import { useQuery, UseQueryOptions } from 'react-query';
import { NAVIGATIONS_QUERY_KEYS } from '~modules/navigation/navigation.consts';
import { NavigationService } from '~modules/navigation/navigation.service';
import { Avo } from '@viaa/avo2-types';

export const useGetAllNavigations = (
	placement?: string,
	options?: UseQueryOptions<
		Avo.Menu.Menu[],
		HTTPError,
		Avo.Menu.Menu[],
		typeof NAVIGATIONS_QUERY_KEYS.getAllNavigations
	>
) => {
	return useQuery(
		NAVIGATIONS_QUERY_KEYS.getAllNavigations,
		() => NavigationService.fetchNavigationItems(placement),
		options
	);
};
