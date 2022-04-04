import { HTTPError } from 'ky';
import { useQuery, UseQueryOptions } from 'react-query';

import { useConfig } from '../../../shared/hooks';
import { NAVIGATION_QUERY_KEYS } from '../../const';
import { Navigation } from '../../types';

export const useGetNavigations = <TData = Navigation[]>(
	options: UseQueryOptions<Navigation[], HTTPError, TData, typeof NAVIGATION_QUERY_KEYS.all> = {
		enabled: true,
	}
) => {
	const navConfig = useConfig('navigation');
	const navService = navConfig?.service;

	return useQuery(
		NAVIGATION_QUERY_KEYS.all,
		() => navService?.getAll() as Promise<Navigation[]>,
		{
			...options,
			enabled: !!options.enabled && !!navService,
		}
	);
};
