import React from 'react';
import { Switch } from 'react-router';
import { renderAdminContentPageRoutes } from './modules/content-page/content-page.routes';
import { renderAdminTranslationsRoutes } from './modules/translations/translations';
import { renderAdminUserGroupRoutes } from './modules/user-group/user-group';
import { renderAdminUserRoutes } from './modules/user/user';
import { Route } from 'react-router-dom';
import ContentPageWrapper from './modules/content-page/ContentPageWrapper';
import { renderAdminNavigationRoutes } from './modules/navigations/navigation.routes';

export const renderAdminRoutes = () => {
	return (
		<Switch>
			{renderAdminContentPageRoutes()}
			{renderAdminUserGroupRoutes()}
			{renderAdminTranslationsRoutes()}
			{renderAdminNavigationRoutes()}
			{renderAdminUserRoutes()}
			<Route
				key="content-page-resolve-routes"
				render={() => <ContentPageWrapper />}
				exact
				path={'/:path'}
			/>
			,
		</Switch>
	);
};
