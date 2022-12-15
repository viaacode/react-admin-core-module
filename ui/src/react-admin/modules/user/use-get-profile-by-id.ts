import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { USER_QUERY_KEYS } from '~modules/user/user.consts';
import { UserService } from '~modules/user/user.service';
import { CommonUser } from '~modules/user/user.types';

export const useGetProfileById = (
	id: string | undefined | null,
	options?: UseQueryOptions<
		CommonUser | null,
		any,
		CommonUser | null,
		typeof USER_QUERY_KEYS.getProfileById[]
	>
) => {
	return useQuery(
		[USER_QUERY_KEYS.getProfileById],
		() => {
			if (!id) {
				return null;
			}
			return UserService.getUserById(String(id));
		},
		options
	);
};
