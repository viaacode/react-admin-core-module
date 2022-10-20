import React, { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { ROUTE_PARTS } from '~modules/shared/consts/routes';

import { ContentPageOverviewPage } from './ContentPageOverviewPage';
import ContentPageEditPage from './ContentPageEditPage';
import ContentPageDetailPage from './ContentPageDetailPage';

export const CONTENT_PATH = {
	CONTENT_PAGE_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}`,
	CONTENT_PAGE_CREATE: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}/${ROUTE_PARTS.create}`,
	CONTENT_PAGE_DETAIL: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}/:id`,
	CONTENT_PAGE_EDIT: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}/:id/${ROUTE_PARTS.edit}`,
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
			key={CONTENT_PATH.CONTENT_PAGE_OVERVIEW}
			render={() => <ContentPageOverviewPage />}
			exact
			path={CONTENT_PATH.CONTENT_PAGE_OVERVIEW}
		/>,
		<Route
			key={CONTENT_PATH.CONTENT_PAGE_CREATE}
			render={() => <ContentPageEditPage />}
			exact
			path={CONTENT_PATH.CONTENT_PAGE_CREATE}
		/>,
		<Route
			key={CONTENT_PATH.CONTENT_PAGE_DETAIL}
			render={() => <ContentPageDetailPage />}
			exact
			path={CONTENT_PATH.CONTENT_PAGE_DETAIL}
		/>,
		<Route
			key={CONTENT_PATH.CONTENT_PAGE_EDIT}
			render={() => <ContentPageEditPage />}
			exact
			path={CONTENT_PATH.CONTENT_PAGE_EDIT}
		/>,
	];
};
