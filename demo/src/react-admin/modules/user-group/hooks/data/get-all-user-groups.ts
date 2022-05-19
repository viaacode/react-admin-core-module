import { HTTPError } from 'ky';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { Config } from '~core/config';

import { USER_GROUP_QUERY_KEYS } from '../../const/user-group.const';
import { UserGroupArchief } from '../../types/user-group.types';

export const useGetUserGroups = <TData = UserGroupArchief[]>(
	options: UseQueryOptions<UserGroupArchief[], HTTPError, TData, typeof USER_GROUP_QUERY_KEYS.all> = {
		enabled: true,
	}
): UseQueryResult<TData, HTTPError> => {
	return useQuery(
		USER_GROUP_QUERY_KEYS.all,
		() => Config.getConfig().services.UserGroupsService.getAllUserGroups() as Promise<UserGroupArchief[]>,
		{
			...options,
			enabled: !!options.enabled,
		}
	);
};