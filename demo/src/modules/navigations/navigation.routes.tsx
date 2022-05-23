import React, { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { NAVIGATION_PATH } from '~modules/navigation/navigation.consts';
import NavigationOverviewPage from './NavigationOverviewPage';
import NavigationDetailPage from './NavigationDetailPage';
import NavigationEditPage from './NavigationEditPage';

export const renderAdminNavigationRoutes = (): ReactNode[] => [
	<Route
		key={NAVIGATION_PATH.NAVIGATION_OVERVIEW}
		render={() => <NavigationOverviewPage />}
		exact
		path={NAVIGATION_PATH.NAVIGATION_OVERVIEW}
	/>,
	<Route
		key={NAVIGATION_PATH.NAVIGATION_CREATE}
		render={() => <NavigationEditPage />}
		exact
		path={NAVIGATION_PATH.NAVIGATION_CREATE}
	/>,
	<Route
		key={NAVIGATION_PATH.NAVIGATION_DETAIL}
		render={() => <NavigationDetailPage />}
		exact
		path={NAVIGATION_PATH.NAVIGATION_DETAIL}
	/>,
	<Route
		key={NAVIGATION_PATH.NAVIGATION_ITEM_CREATE}
		render={() => <NavigationEditPage />}
		exact
		path={NAVIGATION_PATH.NAVIGATION_ITEM_CREATE}
	/>,
	<Route
		key={NAVIGATION_PATH.NAVIGATION_ITEM_EDIT}
		render={() => <NavigationEditPage />}
		exact
		path={NAVIGATION_PATH.NAVIGATION_ITEM_EDIT}
	/>,
];
