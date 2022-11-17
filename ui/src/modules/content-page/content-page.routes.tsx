import React, { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { ContentPageOverviewPage } from './ContentPageOverviewPage';
import ContentPageEditPage from './ContentPageEditPage';
import ContentPageDetailPage from './ContentPageDetailPage';
import { AdminConfigManager, CONTENT_PAGE_PATH } from '../../react-admin';

export const renderAdminContentPageRoutes = (
	parts = AdminConfigManager.getConfig().route_parts
): ReactNode[] => {
	return [
		<Route
			key={CONTENT_PAGE_PATH(parts).OVERVIEW}
			render={() => <ContentPageOverviewPage />}
			exact
			path={CONTENT_PAGE_PATH(parts).OVERVIEW}
		/>,
		<Route
			key={CONTENT_PAGE_PATH(parts).CREATE}
			render={() => <ContentPageEditPage />}
			exact
			path={CONTENT_PAGE_PATH(parts).CREATE}
		/>,
		<Route
			key={CONTENT_PAGE_PATH(parts).DETAIL}
			render={() => <ContentPageDetailPage />}
			exact
			path={CONTENT_PAGE_PATH(parts).DETAIL}
		/>,
		<Route
			key={CONTENT_PAGE_PATH(parts).EDIT}
			render={() => <ContentPageEditPage />}
			exact
			path={CONTENT_PAGE_PATH(parts).EDIT}
		/>,
	];
};
