import React, { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { ROUTE_PARTS } from '~modules/shared/consts/routes';

import { ContentPageOverviewPage } from './ContentPageOverviewPage';
import ContentPageEditPage from './ContentPageEditPage';
import ContentPageDetailPage from './ContentPageDetailPage';

export const CONTENT_PAGE_PATH = {
	OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}`,
	CREATE: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}/${ROUTE_PARTS.create}`,
	DETAIL: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}/:id`,
	EDIT: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}/:id/${ROUTE_PARTS.edit}`,
	PAGES: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=PAGINA`,
	NEWS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=NIEUWS_ITEM`,
	FAQS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=FAQ_ITEM`,
	SCREENCASTS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=SCREENCAST`,
	PROJECTS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=PROJECT`,
	OVERVIEWS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=OVERZICHT`,
};

export const renderAdminContentPageRoutes = (): ReactNode[] => {
	return [
		<Route
			key={CONTENT_PAGE_PATH.OVERVIEW}
			render={() => <ContentPageOverviewPage />}
			exact
			path={CONTENT_PAGE_PATH.OVERVIEW}
		/>,
		<Route
			key={CONTENT_PAGE_PATH.CREATE}
			render={() => <ContentPageEditPage />}
			exact
			path={CONTENT_PAGE_PATH.CREATE}
		/>,
		<Route
			key={CONTENT_PAGE_PATH.DETAIL}
			render={() => <ContentPageDetailPage />}
			exact
			path={CONTENT_PAGE_PATH.DETAIL}
		/>,
		<Route
			key={CONTENT_PAGE_PATH.EDIT}
			render={() => <ContentPageEditPage />}
			exact
			path={CONTENT_PAGE_PATH.EDIT}
		/>,
	];
};
