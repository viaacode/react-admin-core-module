import { useQuery } from '@tanstack/react-query';
import { UserService } from '~modules/user/user.service';
import { QUERY_KEYS } from '~shared/types';

export const useGetNamesByProfileIds = (profileIds: string[] | undefined) => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_NAMES_BY_PROFILE_IDS, profileIds],
		queryFn: async () => {
			if (!profileIds?.length) {
				return [];
			}

			return UserService.getNamesByProfileIds(profileIds);
		},
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});
};
