import { useQuery } from '@tanstack/react-query';
import { UserGroupService } from '~modules/user-group/services/user-group.service';
import { QUERY_KEYS } from '~shared/types';

interface GetUserGroupsParams {
	withPermissions: boolean;
}

export const useGetUserGroups = (props: GetUserGroupsParams) => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_USER_GROUPS, props],
		queryFn: (props) => {
			const userGroupsParams = props.queryKey[1] as GetUserGroupsParams;

			if (userGroupsParams.withPermissions) {
				return UserGroupService.fetchUserGroupsWithPermissions();
			} else {
				return UserGroupService.fetchUserGroups();
			}
		},
		gcTime: Infinity,
		staleTime: Infinity,
	});
};
