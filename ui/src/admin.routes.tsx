import React from 'react';
import {Route, Routes} from 'react-router';
import {renderAdminAlertsRoutes} from './modules/alerts/alerts';
import {ContentPageWrapper} from './modules/content-page/ContentPageWrapper';
import {renderAdminContentPageRoutes} from './modules/content-page/content-page.routes';
import {renderAdminContentPageLabelRoutes} from './modules/content-page-labels/content-page-labels.routes';
import {renderAdminNavigationRoutes} from './modules/navigations/navigation.routes';
import {renderAdminTranslationsRoutes} from './modules/translations/translations';
import {renderAdminUserRoutes} from './modules/user/user';
import {renderAdminUserGroupRoutes} from './modules/user-group/user-group';

export const renderAdminRoutes = () => {
	return (
		<Routes>
			{renderAdminAlertsRoutes()}
			{renderAdminContentPageRoutes()}
			{renderAdminContentPageLabelRoutes()}
			{renderAdminUserGroupRoutes()}
			{renderAdminTranslationsRoutes()}
			{renderAdminNavigationRoutes()}
			{renderAdminUserRoutes()}
			<Route path={'/:path'} Component={ContentPageWrapper} />,
		</Routes>
	);
};
