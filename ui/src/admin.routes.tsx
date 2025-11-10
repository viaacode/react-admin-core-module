import React from 'react';
import { Routes } from 'react-router';
import { renderAdminAlertsRoutes } from './modules/alerts/alerts.js';
import { renderAdminContentPageRoutes } from './modules/content-page/content-page.routes.js';
import { renderAdminContentPageLabelRoutes } from './modules/content-page-labels/content-page-labels.routes.js';
import { renderAdminNavigationRoutes } from './modules/navigations/navigation.routes.js';
import { renderAdminTranslationsRoutes } from './modules/translations/translations.js';
import { renderAdminUserRoutes } from './modules/user/user.js';
import { renderAdminUserGroupRoutes } from './modules/user-group/user-group.js';

export const renderAdminRoutes = () => {
	return (
		<Routes>
			{renderAdminAlertsRoutes()}
			{renderAdminContentPageRoutes()}
			{renderAdminContentPageLabelRoutes()}
			{renderAdminUserGroupRoutes()}
			{renderAdminTranslationsRoutes()}
			{renderAdminNavigationRoutes()}
			{renderAdminUserRoutes()}
		</Routes>
	);
};
