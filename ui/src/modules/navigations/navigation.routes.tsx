import React, { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { AdminConfigManager } from '~core/config';
import NavigationOverviewPage from './NavigationOverviewPage';
import NavigationDetailPage from './NavigationDetailPage';
import NavigationEditPage from './NavigationEditPage';

export const renderAdminNavigationRoutes = (): ReactNode[] => [
	<Route
		key={AdminConfigManager.getConfig().routes.NAVIGATION_OVERVIEW}
		render={() => <NavigationOverviewPage />}
		exact
		path={AdminConfigManager.getConfig().routes.NAVIGATION_OVERVIEW}
	/>,
	<Route
		key={AdminConfigManager.getConfig().routes.NAVIGATION_CREATE}
		render={() => <NavigationEditPage />}
		exact
		path={AdminConfigManager.getConfig().routes.NAVIGATION_CREATE}
	/>,
	<Route
		key={AdminConfigManager.getConfig().routes.NAVIGATION_DETAIL}
		render={() => <NavigationDetailPage />}
		exact
		path={AdminConfigManager.getConfig().routes.NAVIGATION_DETAIL}
	/>,
	<Route
		key={AdminConfigManager.getConfig().routes.NAVIGATION_ITEM_CREATE}
		render={() => <NavigationEditPage />}
		exact
		path={AdminConfigManager.getConfig().routes.NAVIGATION_ITEM_CREATE}
	/>,
	<Route
		key={AdminConfigManager.getConfig().routes.NAVIGATION_ITEM_EDIT}
		render={() => <NavigationEditPage />}
		exact
		path={AdminConfigManager.getConfig().routes.NAVIGATION_ITEM_EDIT}
	/>,
];
