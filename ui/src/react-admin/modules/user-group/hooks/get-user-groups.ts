import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { UserGroupService } from '~modules/user-group/services/user-group.service';
import { UserGroup, UserGroupWithPermissions } from '~modules/user-group/types/user-group.types';

import { USER_GROUP_QUERY_KEYS } from '../const/user-group.const';

interface GetUserGroupsParams {
	withPermissions: boolean;
}

export const useGetUserGroups = <TData = UserGroup[] | UserGroupWithPermissions[]>(
	props: GetUserGroupsParams
): UseQueryResult<TData, any> => {
	return useQuery(
		[USER_GROUP_QUERY_KEYS.getUserGroups, props],
		(props) => {
			const userGroupsParams = props.queryKey[1] as GetUserGroupsParams;

			if (userGroupsParams.withPermissions) {
				return UserGroupService.fetchUserGroupsWithPermissions() as Promise<
					UserGroupWithPermissions[]
				>;
			} else {
				return UserGroupService.fetchUserGroups() as Promise<UserGroup[]>;
			}
		},
		{
			cacheTime: 60,
			keepPreviousData: true,
		}
	);
};
