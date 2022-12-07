import { HTTPError } from 'ky';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { UserGroupService } from '~modules/user-group/services/user-group.service';
import { UserGroup } from '~modules/user-group/types/user-group.types';

import { USER_GROUP_QUERY_KEYS } from '../const/user-group.const';

export const useGetUserGroups = <TData = UserGroup[]>(
	options: UseQueryOptions<UserGroup[], HTTPError, TData, typeof USER_GROUP_QUERY_KEYS.all> = {
		enabled: true,
	}
): UseQueryResult<TData, HTTPError> => {
	return useQuery(
		USER_GROUP_QUERY_KEYS.all,
		() => {
			return UserGroupService.fetchUserGroups() as Promise<UserGroup[]>;
		},
		{
			...options,
			enabled: !!options.enabled,
		}
	);
};
