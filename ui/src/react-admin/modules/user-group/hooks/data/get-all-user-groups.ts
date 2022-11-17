import { HTTPError } from 'ky';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { AdminConfigManager } from '~core/config';

import { USER_GROUP_QUERY_KEYS } from '../../const/user-group.const';
import { UserGroupWithPermissions } from '../../types/user-group.types';

export const useGetUserGroups = <TData = UserGroupWithPermissions[]>(
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
		() =>
			AdminConfigManager.getConfig().services.UserGroupsService.getAllUserGroups() as Promise<
				UserGroupWithPermissions[]
			>,
		{
			...options,
			enabled: !!options.enabled,
		}
	);
};
