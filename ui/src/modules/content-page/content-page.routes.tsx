import React, { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { ROUTE_PARTS } from '~modules/shared/consts/routes';

import { ContentPageOverviewPage } from './ContentPageOverviewPage';
import ContentPageEditPage from './ContentPageEditPage';
import ContentPageDetailPage from './ContentPageDetailPage';
import { AdminConfigManager } from '../../react-admin';

export const CONTENT_PAGE_PATH = (parts = ROUTE_PARTS) => ({
	OVERVIEW: `/${parts.admin}/${parts.content}`,
	CREATE: `/${parts.admin}/${parts.content}/${parts.create}`,
	DETAIL: `/${parts.admin}/${parts.content}/:id`,
	EDIT: `/${parts.admin}/${parts.content}/:id/${parts.edit}`,
	PAGES: `/${parts.admin}/${parts.content}?content_type=PAGINA`,
	NEWS: `/${parts.admin}/${parts.content}?content_type=NIEUWS_ITEM`,
	FAQS: `/${parts.admin}/${parts.content}?content_type=FAQ_ITEM`,
	SCREENCASTS: `/${parts.admin}/${parts.content}?content_type=SCREENCAST`,
	PROJECTS: `/${parts.admin}/${parts.content}?content_type=PROJECT`,
	OVERVIEWS: `/${parts.admin}/${parts.content}?content_type=OVERZICHT`,
});

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
