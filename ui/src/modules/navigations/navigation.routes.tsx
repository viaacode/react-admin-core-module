import React, { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { AdminConfigManager } from '~core/config';
import NavigationOverviewPage from './NavigationOverviewPage';
import NavigationDetailPage from './NavigationDetailPage';
import NavigationEditPage from './NavigationEditPage';

export const renderAdminNavigationRoutes = (): ReactNode[] => [
	<Route
		key={AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_OVERVIEW')}
		render={() => <NavigationOverviewPage />}
		exact
		path={AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_OVERVIEW')}
	/>,
	<Route
		key={AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_CREATE')}
		render={() => <NavigationEditPage />}
		exact
		path={AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_CREATE')}
	/>,
	<Route
		key={AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_DETAIL')}
		render={() => <NavigationDetailPage />}
		exact
		path={AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_DETAIL')}
	/>,
	<Route
		key={AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_ITEM_CREATE')}
		render={() => <NavigationEditPage />}
		exact
		path={AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_ITEM_CREATE')}
	/>,
	<Route
		key={AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_ITEM_EDIT')}
		render={() => <NavigationEditPage />}
		exact
		path={AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_ITEM_EDIT')}
	/>,
];
