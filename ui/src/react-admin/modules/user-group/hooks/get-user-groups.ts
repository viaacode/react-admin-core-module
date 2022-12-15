import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { UserGroupService } from '~modules/user-group/services/user-group.service';
import { UserGroup } from '~modules/user-group/types/user-group.types';

import { USER_GROUP_QUERY_KEYS } from '../const/user-group.const';

export const useGetUserGroups = <TData = UserGroup[]>(): UseQueryResult<TData, any> => {
	return useQuery([USER_GROUP_QUERY_KEYS.getUserGroups], () => {
		return UserGroupService.fetchUserGroups() as Promise<UserGroup[]>;
	});
};
