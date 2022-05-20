import { ReactNode } from 'react';
import { Route } from 'react-router-dom';

import { USER_PATH } from '~modules/shared/consts/user.const';
import UserOverview from '~modules/user/views/UserOverview';

export const renderAdminUserRoutes = (): ReactNode[] => {
	return [
		<Route
			key={USER_PATH.USER_OVERVIEW}
			render={() => <UserOverview />}
			exact
			path={USER_PATH.USER_OVERVIEW}
		/>,
	];
};
