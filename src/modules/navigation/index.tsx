import React, { FC } from 'react';

import { RouteConfigComponentProps } from '../../core/routes';
import { RenderChildRoutes } from '../shared/components';

import { NAVIGATION_PATHS } from './const';
import { NavigationDetail, NavigationOverview } from './pages';

// TODO: This is necessary when having nested routes but maybe it's better to just have a flat
// list of routes, this will make the RenderChildRoutes obsolete
const NavigationRoot: FC<RouteConfigComponentProps> = ({ route }) => {
	console.log(route);

	return <RenderChildRoutes routes={route.routes} />;
};

export const NAVIGATION_ROUTES_CONFIG = {
	path: '/navigatie',
	component: NavigationRoot,
	redirect: NAVIGATION_PATHS.overview,
	routes: [
		{
			path: '/navigatie/overzicht',
			component: NavigationOverview,
		},
		{
			path: '/navigatie/:navigationId',
			component: NavigationDetail,
		},
	],
};
