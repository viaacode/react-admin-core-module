import { useQuery } from '@tanstack/react-query';
import type { Avo } from '@viaa/avo2-types';
import { UserService } from '~modules/user/user.service.js';
import type { UserOverviewTableCol } from '~modules/user/user.types.js';
import { USERS_PER_PAGE } from '~modules/user/user.types.js';
import { QUERY_KEYS } from '~shared/types/index.js';

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
	options: { enabled?: boolean } = {
		enabled: true,
	}
) => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_PROFILES, getProfileArguments],
		queryFn: (props) => {
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
		enabled: true,
		...options,
	});
};
