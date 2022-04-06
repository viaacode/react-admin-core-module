import React, { ReactNode } from 'react';
import { Route } from 'react-router-dom';

import { DASHBOARD_PATH } from './dashboard.const';
import { Dashboard } from './views';

export const renderAdminDashboardRoutes = (): ReactNode[] => [
	<Route
		key={DASHBOARD_PATH.DASHBOARD}
		component={Dashboard}
		exact
		path={DASHBOARD_PATH.DASHBOARD}
	/>,
];
