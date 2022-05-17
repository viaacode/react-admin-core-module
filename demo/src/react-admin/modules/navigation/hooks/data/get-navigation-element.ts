import { HTTPError } from 'ky';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';

import { NAVIGATION_QUERY_KEYS } from '../../const';
import { NavigationElement } from '../../types';

import { Config } from '~core/config';

export const useGetNavigationElement = <TData = NavigationElement>(
	id: string,
	options: UseQueryOptions<
		NavigationElement,
		HTTPError,
		TData,
		ReturnType<typeof NAVIGATION_QUERY_KEYS.detail>
	> = { enabled: true }
): UseQueryResult<TData, HTTPError> => {
	const navConfig = Config.getConfig().navigation;
	const navService = navConfig?.service;

	return useQuery(
		NAVIGATION_QUERY_KEYS.detail(id),
		() => navService?.getById(id) as Promise<NavigationElement>,
		{
			...options,
			enabled: !!options.enabled && !!navService,
		}
	);
};