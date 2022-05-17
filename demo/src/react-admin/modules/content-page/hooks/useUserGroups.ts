import { useEffect, useState } from 'react';

import { GET_SPECIAL_USER_GROUPS } from '~modules/user-group/const/user-group.const';
import { UserGroupService } from '~modules/user-group/services/user-group.service';
import { UserGroup } from '~modules/user-group/types/user-group.types';

type UseUserGroupsTuple = [Partial<UserGroup>[], boolean];

export const useUserGroups = (includeSpecialGroups: boolean): UseUserGroupsTuple => {
	const [userGroups, setUserGroups] = useState<Partial<UserGroup>[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		setIsLoading(true);

		UserGroupService.fetchAllUserGroups()
			.then((groups) => {
				if (groups) {
					setUserGroups([
						...(includeSpecialGroups ? GET_SPECIAL_USER_GROUPS() : []),
						...groups,
					]);
				}
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [includeSpecialGroups]);

	return [userGroups, isLoading];
};
