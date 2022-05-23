import React, { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { NAVIGATION_PATH } from '~modules/navigation/navigation.consts';
import { NavigationDetail, NavigationEdit } from '~modules/navigation/views';
import NavigationOverviewPage from './NavigationOverviewPage';

export const renderAdminNavigationRoutes = (): ReactNode[] => [
	<Route
		key={NAVIGATION_PATH.NAVIGATION_OVERVIEW}
		render={() => <NavigationOverviewPage />}
		exact
		path={NAVIGATION_PATH.NAVIGATION_OVERVIEW}
	/>,
	<Route
		key={NAVIGATION_PATH.NAVIGATION_CREATE}
		render={() => <NavigationEdit />}
		exact
		path={NAVIGATION_PATH.NAVIGATION_CREATE}
	/>,
	<Route
		key={NAVIGATION_PATH.NAVIGATION_DETAIL}
		render={() => <NavigationDetail />}
		exact
		path={NAVIGATION_PATH.NAVIGATION_DETAIL}
	/>,
	<Route
		key={NAVIGATION_PATH.NAVIGATION_ITEM_CREATE}
		render={() => <NavigationEdit />}
		exact
		path={NAVIGATION_PATH.NAVIGATION_ITEM_CREATE}
	/>,
	<Route
		key={NAVIGATION_PATH.NAVIGATION_ITEM_EDIT}
		render={() => <NavigationEdit />}
		exact
		path={NAVIGATION_PATH.NAVIGATION_ITEM_EDIT}
	/>,
];
