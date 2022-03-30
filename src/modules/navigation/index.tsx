import React, { FC } from 'react';

import { ModuleRouteConfig, RouteConfigComponentProps } from '../../core/routes';
import { RenderChildRoutes } from '../shared/components';

import { NAVIGATION_PATHS } from './const';
import { NavigationOverview } from './pages';

export * from './const';

// TODO: This is necessary when having nested routes but maybe it's better to just have a flat
// list of routes, this will make the RenderChildRoutes obsolete
const NavigationRoot: FC<RouteConfigComponentProps> = ({ route }) => {
	return <RenderChildRoutes routes={route.routes} />;
};

export const NAVIGATION_ROUTES_CONFIG: ModuleRouteConfig = {
	path: NAVIGATION_PATHS.overview,
	navigation: {
		label: 'Navigatie',
		order: 2,
	},
	component: NavigationRoot,
	redirect: NAVIGATION_PATHS.overview + '/overzicht',
	routes: [
		{
			path: NAVIGATION_PATHS.overview + '/overzicht',
			component: NavigationOverview,
			exact: true,
		},
	],
};
