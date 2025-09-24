import type { ReactNode } from 'react';
import React from 'react';
import { Route } from 'react-router-dom';
import { AdminConfigManager } from '~core/config';
import ContentPageDetailPage from './ContentPageDetailPage';
import ContentPageEditPage from './ContentPageEditPage';
import { ContentPageOverviewPage } from './ContentPageOverviewPage';
import ContentPagePreviewPage from './ContentPagePreviewPage';

export const renderAdminContentPageRoutes = (): ReactNode[] => {
	return [
		<Route
			key={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_OVERVIEW')}
			render={() => <ContentPageOverviewPage />}
			exact
			path={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_OVERVIEW')}
		/>,
		<Route
			key={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_CREATE')}
			render={() => <ContentPageEditPage />}
			exact
			path={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_CREATE')}
		/>,
		<Route
			key={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_DETAIL')}
			render={() => <ContentPageDetailPage />}
			exact
			path={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_DETAIL')}
		/>,
		<Route
			key={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_EDIT')}
			render={() => <ContentPageEditPage />}
			exact
			path={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_EDIT')}
		/>,
	];
};

export const renderAdminContentPagePreviewRoute = (): ReactNode[] => {
	return [
		<Route key="content-page-preview" render={() => <ContentPagePreviewPage />} exact path="*" />,
	];
};
