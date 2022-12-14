import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { UserGroupService } from '~modules/user-group/services/user-group.service';

import { USER_GROUP_QUERY_KEYS } from '../const/user-group.const';
import { UserGroupWithPermissions } from '../types/user-group.types';

export const useGetUserGroupsWithPermissions = <
	TData = UserGroupWithPermissions[]
>(): UseQueryResult<TData, any> => {
	return useQuery([USER_GROUP_QUERY_KEYS.getUserGroupsWithPermissions], () => {
		return UserGroupService.fetchUserGroupsWithPermissions() as Promise<
			UserGroupWithPermissions[]
		>;
	});
};
