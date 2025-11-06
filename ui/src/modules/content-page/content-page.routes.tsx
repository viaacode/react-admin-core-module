import type { ReactNode } from 'react';
import React from 'react';
import { Route } from 'react-router-dom';
import { AdminConfigManager } from '~core/config/config.class.js';
import { ContentPageDetailPage } from './ContentPageDetailPage';
import { ContentPageEditPage } from './ContentPageEditPage';
import { ContentPageOverviewPage } from './ContentPageOverviewPage';
import { ContentPagePreviewPage } from './ContentPagePreviewPage';

export const renderAdminContentPageRoutes = (): ReactNode[] => {
	return [
		<Route
			path={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_OVERVIEW')}
			Component={ContentPageOverviewPage}
			key={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_OVERVIEW')}
		/>,
		<Route
			path={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_CREATE')}
			Component={ContentPageEditPage}
			key={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_CREATE')}
		/>,
		<Route
			path={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_DETAIL')}
			Component={ContentPageDetailPage}
			key={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_DETAIL')}
		/>,
		<Route
			path={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_EDIT')}
			Component={ContentPageEditPage}
			key={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_EDIT')}
		/>,
		<Route key="content-page-preview" Component={ContentPagePreviewPage} path="*" />,
	];
};
