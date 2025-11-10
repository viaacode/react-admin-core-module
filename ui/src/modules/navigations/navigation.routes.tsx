import type { ReactNode } from 'react';
import React from 'react';
import { Route } from 'react-router-dom';
import { AdminConfigManager } from '~core/config/config.class.js';
import { NavigationDetailPage } from './NavigationDetailPage.js';
import { NavigationEditPage } from './NavigationEditPage.js';
import { NavigationOverviewPage } from './NavigationOverviewPage.js';

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
