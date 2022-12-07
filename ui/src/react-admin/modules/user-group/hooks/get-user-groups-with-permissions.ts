import { HTTPError } from 'ky';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { UserGroupService } from '~modules/user-group/services/user-group.service';

import { USER_GROUP_QUERY_KEYS } from '../const/user-group.const';
import { UserGroupWithPermissions } from '../types/user-group.types';

export const useGetUserGroupsWithPermissions = <TData = UserGroupWithPermissions[]>(
	options: UseQueryOptions<
		UserGroupWithPermissions[],
		HTTPError,
		TData,
		typeof USER_GROUP_QUERY_KEYS.all
	> = {
		enabled: true,
	}
): UseQueryResult<TData, HTTPError> => {
	return useQuery(
		USER_GROUP_QUERY_KEYS.all,
		() => {
			return UserGroupService.fetchUserGroupsWithPermissions() as Promise<
				UserGroupWithPermissions[]
			>;
		},
		{
			...options,
			enabled: !!options.enabled,
		}
	);
};
