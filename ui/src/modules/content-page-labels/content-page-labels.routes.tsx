import type { ReactNode } from 'react';
import React from 'react';
import { Route } from 'react-router-dom';
import { AdminConfigManager } from '~core/config';
import { ContentPageLabelsDetailPage } from './ContentPageLabelsDetailPage';
import { ContentPageLabelsEditPage } from './ContentPageLabelsEditPage';
import { ContentPageLabelsOverviewPage } from './ContentPageLabelsOverviewPage';

export const renderAdminContentPageLabelRoutes = (): ReactNode[] => {
	return [
		<Route
			path={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_OVERVIEW')}
			Component={ContentPageLabelsOverviewPage}
			key={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_OVERVIEW')}
		/>,
		<Route
			path={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_CREATE')}
			Component={ContentPageLabelsEditPage}
			key={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_CREATE')}
		/>,
		<Route
			path={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_DETAIL')}
			Component={ContentPageLabelsDetailPage}
			key={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_DETAIL')}
		/>,
		<Route
			path={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_EDIT')}
			Component={ContentPageLabelsEditPage}
			key={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_EDIT')}
		/>,
	];
};
