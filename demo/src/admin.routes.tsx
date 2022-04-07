import { every, some } from 'lodash-es';
import React, { ReactNode } from 'react';
import { Switch } from 'react-router';
import { Permission } from './react-admin/modules/user/user.types';
import { renderAdminDashboardRoutes } from './admin/dashboard/dashboard.routes';
import { renderAdminContentRoutes } from './modules/content-page/content.routes';

export const renderAdminRoutes = (userPermissions: Permission[]) => {
	const renderWithPermissions = (
		renderFunc: (userPermissions: Permission[]) => ReactNode[],
		permissions: Permission[],
		booleanOperator: 'AND' | 'OR' = 'OR'
	): ReactNode[] => {
		if (booleanOperator === 'OR') {
			// OR
			// If at least one of the permissions is met, render the routes
			if (some(permissions, (permission) => userPermissions.includes(permission))) {
				return renderFunc(userPermissions);
			}
		} else {
			// AND
			// All permissions have to be met
			if (every(permissions, (permission) => userPermissions.includes(permission))) {
				return renderFunc(userPermissions);
			}
		}
		return [];
	};

	return (
		<Switch>
			{renderAdminDashboardRoutes()}
			{/*{renderWithPermissions(renderAdminUserRoutes, [Permission.VIEW_USERS])}*/}
			{/*{renderWithPermissions(renderAdminUserGroupRoutes, [Permission.EDIT_USER_GROUPS])}*/}
			{/*{renderWithPermissions(renderAdminPermissionGroupRoutes, [*/}
			{/*	Permission.EDIT_PERMISSION_GROUPS,*/}
			{/*])}*/}
			{/*{renderWithPermissions(renderAdminMenuRoutes, [Permission.EDIT_NAVIGATION_BARS])}*/}
			{renderWithPermissions(
				renderAdminContentRoutes,
				[Permission.EDIT_OWN_CONTENT_PAGES, Permission.EDIT_ANY_CONTENT_PAGES],
				'OR'
			)}
			{/*{renderWithPermissions(renderAdminContentPageLabelRoutes, [*/}
			{/*	Permission.EDIT_CONTENT_PAGE_LABELS,*/}
			{/*])}*/}
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
