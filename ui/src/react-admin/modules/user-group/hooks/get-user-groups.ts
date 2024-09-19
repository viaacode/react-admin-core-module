import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { UserGroupService } from '~modules/user-group/services/user-group.service';
import type {
	UserGroup,
	UserGroupWithPermissions,
} from '~modules/user-group/types/user-group.types';
import { QUERY_KEYS } from '~shared/types';

interface GetUserGroupsParams {
	withPermissions: boolean;
}

export const useGetUserGroups = <TData = UserGroup[] | UserGroupWithPermissions[]>(
	props: GetUserGroupsParams
): UseQueryResult<TData, any> => {
	return useQuery(
		[QUERY_KEYS.GET_USER_GROUPS, props],
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
