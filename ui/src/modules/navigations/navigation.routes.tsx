import type { ReactNode } from 'react';
import React from 'react';
import { Route } from 'react-router-dom';
import { AdminConfigManager } from '~core/config/config.class';
import { NavigationDetailPage } from './NavigationDetailPage';
import { NavigationEditPage } from './NavigationEditPage';
import { NavigationOverviewPage } from './NavigationOverviewPage';

export const renderAdminNavigationRoutes = (): ReactNode[] => [
	<Route
		path={AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_OVERVIEW')}
		Component={NavigationOverviewPage}
		key={AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_OVERVIEW')}
	/>,
	<Route
		path={AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_CREATE')}
		Component={NavigationEditPage}
		key={AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_CREATE')}
	/>,
	<Route
		path={AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_DETAIL')}
		Component={NavigationDetailPage}
		key={AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_DETAIL')}
	/>,
	<Route
		path={AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_ITEM_CREATE')}
		Component={NavigationEditPage}
		key={AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_ITEM_CREATE')}
	/>,
	<Route
		path={AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_ITEM_EDIT')}
		Component={NavigationEditPage}
		key={AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_ITEM_EDIT')}
	/>,
];
