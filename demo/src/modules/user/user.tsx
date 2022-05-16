import { ReactNode } from "react";
import { Route } from "react-router-dom";

import { CommonUser } from '../../react-admin/modules/user/user.types';
import { USER_PATH } from "~modules/shared/consts/user.const";
import UserOverview from "~modules/user/views/UserOverview";

export const renderAdminUserRoutes = (user: CommonUser): ReactNode[] => {
	return [
		<Route
			key={USER_PATH.USER_OVERVIEW}
			render={() => <UserOverview user={user} />}
			exact
			path={USER_PATH.USER_OVERVIEW}
		/>,
	];
};
