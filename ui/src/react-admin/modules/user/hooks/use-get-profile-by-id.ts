import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { UserService } from '~modules/user/user.service';
import type { Avo } from '@viaa/avo2-types';
import { QUERY_KEYS } from '~shared/types';

export const useGetProfileById = (
	id: string | undefined | null,
	options?: UseQueryOptions<
		Avo.User.CommonUser | null,
		any,
		Avo.User.CommonUser | null,
		typeof QUERY_KEYS.GET_PROFILE_BY_ID[]
	>
): UseQueryResult<Avo.User.CommonUser | null> => {
	return useQuery(
		[QUERY_KEYS.GET_PROFILE_BY_ID],
		() => {
			if (!id) {
				return null;
			}
			return UserService.getUserById(String(id));
		},
		options
	);
};
