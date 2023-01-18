import { useQuery } from '@tanstack/react-query';
import { Avo } from '@viaa/avo2-types';
import { UserService } from '~modules/user/user.service';
import { UserOverviewTableCol, USERS_PER_PAGE } from '~modules/user/user.types';
import { QUERY_KEYS } from '~modules/shared/types';

export interface GetProfileArguments {
	page: number;
	sortColumn: UserOverviewTableCol;
	sortOrder: Avo.Search.OrderDirection;
	tableColumnDataType: string;
	where: any;
	itemsPerPage?: number;
}

export const useGetProfiles = (getProfileArguments?: GetProfileArguments) => {
	return useQuery([QUERY_KEYS.GET_PROFILES, getProfileArguments], (props) => {
		const getProfileArgs = props.queryKey[1] as GetProfileArguments;
		if (!getProfileArgs) {
			return null;
		}
		return UserService.getProfiles(
			getProfileArgs.page,
			getProfileArgs.sortColumn,
			getProfileArgs.sortOrder,
			getProfileArgs.tableColumnDataType,
			getProfileArgs.where || {},
			getProfileArgs.itemsPerPage || USERS_PER_PAGE
		);
	});
};
