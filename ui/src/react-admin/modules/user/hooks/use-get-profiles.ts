import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { Avo } from '@viaa/avo2-types';
import { UserService } from '~modules/user/user.service';
import type { UserOverviewTableCol } from '~modules/user/user.types';
import { USERS_PER_PAGE } from '~modules/user/user.types';
import { QUERY_KEYS } from '~shared/types';

export interface GetProfileArguments {
	page: number;
	sortColumn: UserOverviewTableCol;
	sortOrder: Avo.Search.OrderDirection;
	tableColumnDataType: string;
	// biome-ignore lint/suspicious/noExplicitAny: todo
	where: any;
	itemsPerPage?: number;
}

export const useGetProfiles = (
	getProfileArguments?: GetProfileArguments,
	options: { enabled?: boolean; keepPreviousData?: boolean } = {
		enabled: true,
		keepPreviousData: true,
	}
): UseQueryResult<[Avo.User.CommonUser[], number]> => {
	return useQuery(
		[QUERY_KEYS.GET_PROFILES, getProfileArguments],
		(props) => {
			const getProfileArgs = props.queryKey[1] as GetProfileArguments;
			if (!getProfileArgs) {
				return null;
			}
			const itemsPerPage = getProfileArgs.itemsPerPage || USERS_PER_PAGE;
			return UserService.getProfiles(
				getProfileArgs.page * itemsPerPage,
				itemsPerPage,
				getProfileArgs.sortColumn,
				getProfileArgs.sortOrder,
				getProfileArgs.tableColumnDataType,
				getProfileArgs.where || {}
			);
		},
		{
			enabled: true,
			keepPreviousData: true,
			...options,
		}
	);
};
