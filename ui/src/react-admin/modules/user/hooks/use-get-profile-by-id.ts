import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { Avo } from '@viaa/avo2-types';
import { UserService } from '~modules/user/user.service.js';
import { QUERY_KEYS } from '~shared/types/index.js';

export const useGetProfileById = (
	id: string | undefined | null,
	options?: UseQueryOptions<
		Avo.User.CommonUser | null,
		// biome-ignore lint/suspicious/noExplicitAny: todo
		any,
		Avo.User.CommonUser | null,
		(typeof QUERY_KEYS.GET_PROFILE_BY_ID)[]
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
