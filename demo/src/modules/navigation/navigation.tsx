import { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { NavigationDetail, NavigationElement, NavigationOverview } from '~modules/navigation';
import { NAVIGATION_PATH } from '~modules/navigation/const';
// import { CommonUser } from '~modules/user/user.types';

console.log('nav paths: ', NAVIGATION_PATH);

export const renderAdminNavigationRoutes = (): ReactNode[] => [
	<Route
		key={NAVIGATION_PATH.NAVIGATION_CREATE}
		render={() => <NavigationElement /> }
		exact
		path={NAVIGATION_PATH.NAVIGATION_CREATE}
	/>,
	<Route
		key={NAVIGATION_PATH.NAVIGATION_OVERVIEW}
		render={() => <NavigationOverview /> }
		exact
		path={NAVIGATION_PATH.NAVIGATION_OVERVIEW}
	/>,
	<Route
		key={NAVIGATION_PATH.NAVIGATION_DETAIL_EDIT}
		render={() => <NavigationElement /> }
		exact
		path={NAVIGATION_PATH.NAVIGATION_OVERVIEW}
	/>,
	<Route
		key={NAVIGATION_PATH.NAVIGATION_DETAIL_CREATE}
		render={() => <NavigationElement /> }
		exact
		path={NAVIGATION_PATH.NAVIGATION_OVERVIEW}
	/>,
	<Route
		key={NAVIGATION_PATH.NAVIGATION_DETAIL}
		render={() => <NavigationDetail /> }
		exact
		path={NAVIGATION_PATH.NAVIGATION_DETAIL}
	/>,
];
