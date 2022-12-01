import { ReactNode } from 'react';
import { Route } from 'react-router-dom';

import { USER_GROUP_PATH } from '~modules/user-group/const/user-group.const';
import { UserGroupOverview } from '~modules/user-group/views';

export const renderAdminUserGroupRoutes = (): ReactNode[] => {
	return [
		<Route
			key={USER_GROUP_PATH.USER_GROUP_OVERVIEW}
			render={() => <UserGroupOverview />}
			exact
			path={USER_GROUP_PATH.USER_GROUP_OVERVIEW}
		/>,
	];
};
