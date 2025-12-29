import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { AvoUserCommonUser } from '@viaa/avo2-types';
import { UserService } from '~modules/user/user.service';
import { QUERY_KEYS } from '~shared/types';

export const useGetProfileById = (
	id: string | undefined | null,
	options?: UseQueryOptions<
		AvoUserCommonUser | null,
		// biome-ignore lint/suspicious/noExplicitAny: todo
		any,
		AvoUserCommonUser | null,
		(typeof QUERY_KEYS.GET_PROFILE_BY_ID)[]
	>
): UseQueryResult<AvoUserCommonUser | null> => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_PROFILE_BY_ID],
		queryFn: () => {
			if (!id) {
				return null;
			}
			return UserService.getUserById(String(id));
		},
		...options,
	});
};
