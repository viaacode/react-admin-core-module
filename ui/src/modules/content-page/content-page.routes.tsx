import React, { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { AdminConfigManager } from '~core/config';
import { ContentPageOverviewPage } from './ContentPageOverviewPage';
import ContentPageEditPage from './ContentPageEditPage';
import ContentPageDetailPage from './ContentPageDetailPage';

export const renderAdminContentPageRoutes = (): ReactNode[] => {
	return [
		<Route
			key={AdminConfigManager.getConfig().routes.CONTENT_PAGE_OVERVIEW}
			render={() => <ContentPageOverviewPage />}
			exact
			path={AdminConfigManager.getConfig().routes.CONTENT_PAGE_OVERVIEW}
		/>,
		<Route
			key={AdminConfigManager.getConfig().routes.CONTENT_PAGE_CREATE}
			render={() => <ContentPageEditPage />}
			exact
			path={AdminConfigManager.getConfig().routes.CONTENT_PAGE_CREATE}
		/>,
		<Route
			key={AdminConfigManager.getConfig().routes.CONTENT_PAGE_DETAIL}
			render={() => <ContentPageDetailPage />}
			exact
			path={AdminConfigManager.getConfig().routes.CONTENT_PAGE_DETAIL}
		/>,
		<Route
			key={AdminConfigManager.getConfig().routes.CONTENT_PAGE_EDIT}
			render={() => <ContentPageEditPage />}
			exact
			path={AdminConfigManager.getConfig().routes.CONTENT_PAGE_EDIT}
		/>,
	];
};
