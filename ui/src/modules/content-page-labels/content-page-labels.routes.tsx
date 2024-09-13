import type { ReactNode } from 'react';
import React from 'react';
import { Route } from 'react-router-dom';
import { AdminConfigManager } from '~core/config';
import ContentPageLabelsDetailPage from './ContentPageLabelsDetailPage';
import ContentPageLabelsEditPage from './ContentPageLabelsEditPage';
import { ContentPageLabelsOverviewPage } from './ContentPageLabelsOverviewPage';

export const renderAdminContentPageLabelRoutes = (): ReactNode[] => {
	return [
		<Route
			key={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_OVERVIEW')}
			render={() => <ContentPageLabelsOverviewPage />}
			exact
			path={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_OVERVIEW')}
		/>,
		<Route
			key={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_CREATE')}
			render={() => <ContentPageLabelsEditPage />}
			exact
			path={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_CREATE')}
		/>,
		<Route
			key={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_DETAIL')}
			render={() => <ContentPageLabelsDetailPage />}
			exact
			path={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_DETAIL')}
		/>,
		<Route
			key={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_EDIT')}
			render={() => <ContentPageLabelsEditPage />}
			exact
			path={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_EDIT')}
		/>,
	];
};
