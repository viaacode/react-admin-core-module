import React, { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { ROUTE_PARTS } from '~modules/shared/consts/routes';

import { CommonUser } from '../../react-admin/modules/user/user.types';

import {
	ContentPageDetail,
	ContentPageEdit,
	ContentPageOverview,
} from '../../react-admin/modules/content-page/views';
import { ContentPageOverviewPage } from './ContentPageOverviewPage';

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

export const renderAdminContentPageRoutes = (user: CommonUser): ReactNode[] => {
	return [
		<Route
			key={CONTENT_PATH.CONTENT_PAGE_OVERVIEW}
			render={() => <ContentPageOverviewPage user={user} />}
			exact
			path={CONTENT_PATH.CONTENT_PAGE_OVERVIEW}
		/>,
		<Route
			key={CONTENT_PATH.CONTENT_PAGE_CREATE}
			render={() => <ContentPageEdit user={user} />}
			exact
			path={CONTENT_PATH.CONTENT_PAGE_CREATE}
		/>,
		<Route
			key={CONTENT_PATH.CONTENT_PAGE_DETAIL}
			render={() => <ContentPageDetail user={user} />}
			exact
			path={CONTENT_PATH.CONTENT_PAGE_DETAIL}
		/>,
		<Route
			key={CONTENT_PATH.CONTENT_PAGE_EDIT}
			render={() => <ContentPageEdit user={user} />}
			exact
			path={CONTENT_PATH.CONTENT_PAGE_EDIT}
		/>,
	];
};
