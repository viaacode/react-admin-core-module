import React from 'react';
import { Switch } from 'react-router';
import { renderAdminContentPageRoutes } from './modules/content-page/content.routes';
import { renderAdminTranslationsRoutes } from './modules/translations/translations';
import { renderAdminUserGroupRoutes } from './modules/user-group/user-group';
import { renderAdminUserRoutes } from './modules/user/user';

export const renderAdminRoutes = () => {
	return (
		<Switch>
			{/*{renderWithPermissions(renderAdminUserRoutes, [Permission.VIEW_USERS])}*/}
			{/*{renderWithPermissions(renderAdminUserGroupRoutes, [Permission.EDIT_USER_GROUPS])}*/}
			{/*{renderWithPermissions(renderAdminPermissionGroupRoutes, [*/}
			{/*	Permission.EDIT_PERMISSION_GROUPS,*/}
			{/*])}*/}
			{/*{renderWithPermissions(renderAdminMenuRoutes, [Permission.EDIT_NAVIGATION_BARS])}*/}
			{renderAdminContentPageRoutes()}
			{renderAdminUserGroupRoutes()}
			{renderAdminTranslationsRoutes()}
			{renderAdminUserRoutes()}
			{/*{renderAdminContentPageLabelRoutes()}*/}
			{/*{renderWithPermissions(renderItemRoutes, [Permission.VIEW_ITEMS_OVERVIEW])}*/}
			{/*{renderWithPermissions(renderPublishItemRoutes, [Permission.PUBLISH_ITEMS])}*/}
			{/*{renderWithPermissions(*/}
			{/*	renderCollectionOrBundleRoutes,*/}
			{/*	[Permission.VIEW_COLLECTIONS_OVERVIEW, Permission.VIEW_BUNDLES_OVERVIEW],*/}
			{/*	'OR'*/}
			{/*)}*/}
			{/*{renderWithPermissions(renderInteractiveTourRoutes, [*/}
			{/*	Permission.EDIT_INTERACTIVE_TOURS,*/}
			{/*])}*/}
			{/*{renderWithPermissions(renderAdminTranslationsRoutes, [*/}
			{/*	Permission.EDIT_TRANSLATIONS,*/}
			{/*])}*/}
			{/*{renderWithPermissions(renderQuickLaneRoutes, [*/}
			{/*	Permission.VIEW_ANY_QUICK_LANE_OVERVIEW,*/}
			{/*])}*/}
			{/*/!* Default routes *!/*/}
			{/*{renderErrorRoutes()}*/}
		</Switch>
	);
};
