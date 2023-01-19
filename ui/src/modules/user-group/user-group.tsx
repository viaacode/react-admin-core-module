import { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { AdminConfigManager } from '~core/config';

import { UserGroupOverview } from '~modules/user-group/views';

export const renderAdminUserGroupRoutes = (): ReactNode[] => {
	return [
		<Route
			key={AdminConfigManager.getAdminRoute('USER_GROUP_OVERVIEW')}
			render={() => <UserGroupOverview />}
			exact
			path={AdminConfigManager.getAdminRoute('USER_GROUP_OVERVIEW')}
		/>,
	];
};
