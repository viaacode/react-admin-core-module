import React from 'react';
import { Switch } from 'react-router';
import { renderAdminAlertsRoutes } from './modules/alerts/alerts';
import {
	renderAdminContentPagePreviewRoute,
	renderAdminContentPageRoutes,
} from './modules/content-page/content-page.routes';
import { renderAdminContentPageLabelRoutes } from './modules/content-page-labels/content-page-labels.routes';
import { renderAdminNavigationRoutes } from './modules/navigations/navigation.routes';
import { renderAdminTranslationsRoutes } from './modules/translations/translations';
import { renderAdminUserRoutes } from './modules/user/user';
import { renderAdminUserGroupRoutes } from './modules/user-group/user-group';

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
			{renderAdminContentPagePreviewRoute()}
		</Switch>
	);
};
