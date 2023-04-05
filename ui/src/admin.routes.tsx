import React from 'react';
import { Switch } from 'react-router';
import { mockCommonUser } from './mock-common-user';
import { renderAdminContentPageLabelRoutes } from './modules/content-page-labels/content-page-labels.routes';
import { renderAdminContentPageRoutes } from './modules/content-page/content-page.routes';
import { renderAdminTranslationsRoutes } from './modules/translations/translations';
import { renderAdminUserGroupRoutes } from './modules/user-group/user-group';
import { renderAdminUserRoutes } from './modules/user/user';
import { Route } from 'react-router-dom';
import ContentPageWrapper from './modules/content-page/ContentPageWrapper';
import { renderAdminNavigationRoutes } from './modules/navigations/navigation.routes';
import { renderAdminAlertsRoutes } from './modules/alerts/alerts';

export const renderAdminRoutes = () => {
	return (
		<Switch>
			{renderAdminAlertsRoutes()}
			{renderAdminContentPageRoutes()}
			{renderAdminContentPageLabelRoutes()}
			{renderAdminUserGroupRoutes()}
			{renderAdminTranslationsRoutes()}
			{renderAdminNavigationRoutes()}
			{renderAdminUserRoutes()}
			<Route
				key="content-page-resolve-routes"
				render={() => <ContentPageWrapper commonUser={mockCommonUser} />}
				exact
				path={'/:path'}
			/>
			,
		</Switch>
	);
};
