import React, { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { CONTENT_PAGE_PATH } from '~modules/content-page/const/content-page.consts';
import { ROUTE_PARTS } from '~modules/shared';
import { ContentPageOverviewPage } from './ContentPageOverviewPage';
import ContentPageEditPage from './ContentPageEditPage';
import ContentPageDetailPage from './ContentPageDetailPage';

export const renderAdminContentPageRoutes = (parts?: typeof ROUTE_PARTS): ReactNode[] => {
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
