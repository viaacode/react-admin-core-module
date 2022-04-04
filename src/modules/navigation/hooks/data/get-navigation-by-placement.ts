import { HTTPError } from 'ky';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';

import { useConfig } from '../../../shared/hooks';
import { NAVIGATION_QUERY_KEYS } from '../../const';
import { NavigationElement } from '../../types';

export const useGetNavigationByPlacement = <TData = NavigationElement[]>(
	placement: string,
	options: UseQueryOptions<
		NavigationElement[],
		HTTPError,
		TData,
		ReturnType<typeof NAVIGATION_QUERY_KEYS.list>
	> = { enabled: true }
): UseQueryResult<TData, HTTPError> => {
	const navConfig = useConfig('navigation');
	const navService = navConfig?.service;

	return useQuery(
		NAVIGATION_QUERY_KEYS.list(placement),
		async () => navService?.getByPlacement(placement) ?? [],
		{ ...options, enabled: !!options.enabled && !!navService }
	);
};
