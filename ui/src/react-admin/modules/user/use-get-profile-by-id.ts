import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { UserService } from '~modules/user/user.service';
import { CommonUser } from '~modules/user/user.types';
import { QUERY_KEYS } from '~shared/types';

export const useGetProfileById = (
	id: string | undefined | null,
	options?: UseQueryOptions<
		CommonUser | null,
		any,
		CommonUser | null,
		typeof QUERY_KEYS.GET_PROFILE_BY_ID[]
	>
) => {
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
