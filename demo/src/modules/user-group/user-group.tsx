import { ReactNode } from "react";
import { Route } from "react-router-dom";

import { ROUTE_PARTS } from '~modules/shared/consts/routes';

import { CommonUser } from '../../react-admin/modules/user/user.types';
import { USER_GROUP_PATH } from "~modules/user-group/const/user-group.const";
import { UserGroupOverview } from "~modules/user-group/views";

export const PERMISSIONS_PATH = {
	PERMISSIONS_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.permissions}`,
};


export const renderAdminUserGroupRoutes = (user: CommonUser): ReactNode[] => {
	return [
		<Route
			key={USER_GROUP_PATH.USER_GROUP_OVERVIEW}
			render={() => <UserGroupOverview />}
			exact
			path={USER_GROUP_PATH.USER_GROUP_OVERVIEW}
		/>,
	];
};
