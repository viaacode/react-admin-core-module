import { asyncNoop } from 'es-toolkit';
import { type MiddlewareFunction, type RouteObject, redirect } from 'react-router';
import { Loading } from '~shared/components/Loading/Loading';
import { ROUTE_PARTS } from '~shared/consts';
import App from './App';
import Admin from './admin/Admin';
import { Dashboard } from './admin/dashboard/views';
import { MaintenanceAlertsOverviewPage } from './modules/alerts/MaintenanceAlertsOverviewPage';
import { ContentPageDetailPage } from './modules/content-page/ContentPageDetailPage';
import { ContentPageEditPage } from './modules/content-page/ContentPageEditPage';
import { ContentPageOverviewPage } from './modules/content-page/ContentPageOverviewPage';
import { ContentPagePreviewPage } from './modules/content-page/ContentPagePreviewPage';
import { ContentPageLabelsDetailPage } from './modules/content-page-labels/ContentPageLabelsDetailPage';
import { ContentPageLabelsEditPage } from './modules/content-page-labels/ContentPageLabelsEditPage';
import { ContentPageLabelsOverviewPage } from './modules/content-page-labels/ContentPageLabelsOverviewPage';
import { NavigationBarDetailPage } from './modules/navigations/NavigationBarDetailPage';
import { NavigationBarOverviewPage } from './modules/navigations/NavigationBarOverviewPage';
import { NavigationItemEditPage } from './modules/navigations/NavigationItemEditPage';
import { TranslationsOverviewPage } from './modules/translations/TranslationsOverviewPage';
import { UserDetailPage } from './modules/user/UserDetailPage';
import { UserEditPage } from './modules/user/UserEditPage.tsx';
import { UserOverviewPage } from './modules/user/UserOverviewPage';
import { UserGroupOverview } from './react-admin';
import { fetchContentPageLoader, initAppLoader, passUrlLoader } from './routes.loaders';
import { ErrorBoundary } from './shared/components/ErrorBoundary/ErrorBoundary';
import { getAdminCoreConfig } from './shared/helpers/admin-core-config';

async function logRoutesMiddleware({ request }: Parameters<MiddlewareFunction>[0]) {
	console.info(`${request.method} ${request.url}`);
}

const APP_ROUTES: RouteObject[] = [
	{
		id: 'root-set-admin-core-config',
		path: '/',
		middleware: [logRoutesMiddleware],
		loader: initAppLoader,
		Component: App,
		// hydrateFallbackElement: <FullPageSpinner/>,
		children: [
			////////////////////////////////////////////////////////////////////////////////////////
			// ADMIN ROUTES
			////////////////////////////////////////////////////////////////////////////////////////
			{
				// Redirect /beheer to /admin
				id: 'beheer',
				path: `/${ROUTE_PARTS.beheer}`,
				loader: () => redirect(`/${ROUTE_PARTS.admin}`),
				Component: Loading,
			},
			{
				id: 'admin',
				path: `/${ROUTE_PARTS.admin}`,
				Component: Admin,
				children: getAdminRoutes(),
			},
			{
				id: 'homepage',
				path: `/`,
				loader: fetchContentPageLoader,
				Component: ContentPagePreviewPage,
			},
			////////////////////////////////////////////////////////////////////////////////////////
			// DYNAMIC ROUTES (CONTENT PAGES) AND 404 HANDLING
			////////////////////////////////////////////////////////////////////////////////////////
			// This route needs to be the last one, since it handles all remaining routes
			{
				id: 'content-page-preview-path',
				path: '*',
				loader: fetchContentPageLoader,
				Component: ContentPagePreviewPage,
			},
		],
	},
];

function getAdminRoutes(): RouteObject[] {
	// @ts-ignore
	return [
		{
			id: 'Dashboard',
			Component: Dashboard,
			index: true,
			ErrorBoundary: () => ErrorBoundary('Dashboard--route'),
			hasErrorBoundary: true,
		},
		{
			id: 'ContentPageOverviewPage',
			Component: ContentPageOverviewPage,
			path: getAdminCoreConfig(asyncNoop).routes.ADMIN_CONTENT_PAGE_OVERVIEW,
			ErrorBoundary: () => ErrorBoundary('ContentPageOverviewPage--route'),
			hasErrorBoundary: true,
		},
		{
			id: 'ContentPageEditPage-create',
			Component: ContentPageEditPage,
			path: getAdminCoreConfig(asyncNoop).routes.ADMIN_CONTENT_PAGE_CREATE,
			loader: passUrlLoader,
			ErrorBoundary: () => ErrorBoundary('ContentPageEditPage-create--route'),
			hasErrorBoundary: true,
		},
		{
			id: 'ContentPageEditPage-edit',
			Component: ContentPageEditPage,
			path: getAdminCoreConfig(asyncNoop).routes.ADMIN_CONTENT_PAGE_EDIT,
			loader: passUrlLoader,
			ErrorBoundary: () => ErrorBoundary('ContentPageEditPage-edit--route'),
			hasErrorBoundary: true,
		},
		{
			id: 'ContentPageDetailPage',
			Component: ContentPageDetailPage,
			path: getAdminCoreConfig(asyncNoop).routes.ADMIN_CONTENT_PAGE_DETAIL,
			ErrorBoundary: () => ErrorBoundary('ContentPageDetailPage--route'),
			hasErrorBoundary: true,
		},
		{
			id: 'ContentPageLabelOverviewPage',
			Component: ContentPageLabelsOverviewPage,
			path: getAdminCoreConfig(asyncNoop).routes.ADMIN_CONTENT_PAGE_LABEL_OVERVIEW,
			ErrorBoundary: () => ErrorBoundary('ContentPageLabelOverviewPage--route'),
			hasErrorBoundary: true,
		},
		{
			id: 'ContentPageLabelEditPage-create',
			Component: ContentPageLabelsEditPage,
			path: getAdminCoreConfig(asyncNoop).routes.ADMIN_CONTENT_PAGE_LABEL_CREATE,
			ErrorBoundary: () => ErrorBoundary('ContentPageLabelEditPage-create--route'),
			hasErrorBoundary: true,
		},
		{
			id: 'ContentPageLabelEditPage-edit',
			Component: ContentPageLabelsEditPage,
			path: getAdminCoreConfig(asyncNoop).routes.ADMIN_CONTENT_PAGE_LABEL_EDIT,
			ErrorBoundary: () => ErrorBoundary('ContentPageLabelEditPage-edit--route'),
			hasErrorBoundary: true,
		},
		{
			id: 'ContentPageLabelDetailPage',
			Component: ContentPageLabelsDetailPage,
			path: getAdminCoreConfig(asyncNoop).routes.ADMIN_CONTENT_PAGE_LABEL_DETAIL,
			ErrorBoundary: () => ErrorBoundary('ContentPageLabelDetailPage--route'),
			hasErrorBoundary: true,
		},
		{
			id: 'NavigationBarOverview',
			Component: NavigationBarOverviewPage,
			path: getAdminCoreConfig(asyncNoop).routes.ADMIN_NAVIGATION_OVERVIEW,
			ErrorBoundary: () => ErrorBoundary('NavigationBarOverview--route'),
			hasErrorBoundary: true,
		},
		{
			id: 'NavigationBarDetail',
			Component: NavigationBarDetailPage,
			path: getAdminCoreConfig(asyncNoop).routes.ADMIN_NAVIGATION_DETAIL,
			ErrorBoundary: () => ErrorBoundary('NavigationBarDetail--route'),
			hasErrorBoundary: true,
		},
		{
			id: 'NavigationItemEdit-create',
			Component: NavigationItemEditPage,
			path: getAdminCoreConfig(asyncNoop).routes.ADMIN_NAVIGATION_ITEM_CREATE,
			ErrorBoundary: () => ErrorBoundary('NavigationItemEdit-create--route'),
			hasErrorBoundary: true,
		},
		{
			id: 'NavigationItemEdit-edit',
			Component: NavigationItemEditPage,
			path: getAdminCoreConfig(asyncNoop).routes.ADMIN_NAVIGATION_ITEM_EDIT,
			ErrorBoundary: () => ErrorBoundary('NavigationItemEdit-edit--route'),
			hasErrorBoundary: true,
		},
		{
			id: 'TranslationsOverviewPage',
			Component: TranslationsOverviewPage,
			path: getAdminCoreConfig(asyncNoop).routes.ADMIN_TRANSLATIONS_OVERVIEW,
			ErrorBoundary: () => ErrorBoundary('TranslationsOverviewPage--route'),
			hasErrorBoundary: true,
		},
		{
			id: 'UserGroupOverviewPage',
			Component: UserGroupOverview,
			path: getAdminCoreConfig(asyncNoop).routes.ADMIN_USER_GROUP_OVERVIEW,
			ErrorBoundary: () => ErrorBoundary('UserGroupOverviewPage--route'),
			hasErrorBoundary: true,
		},
		{
			id: 'UserOverviewPage',
			Component: UserOverviewPage,
			path: getAdminCoreConfig(asyncNoop).routes.ADMIN_USER_OVERVIEW,
			ErrorBoundary: () => ErrorBoundary('UserOverviewPage--route'),
			hasErrorBoundary: true,
		},
		{
			id: 'UserDetailPage',
			Component: UserDetailPage,
			path: getAdminCoreConfig(asyncNoop).routes.ADMIN_USER_DETAIL,
			ErrorBoundary: () => ErrorBoundary('UserDetailPage--route'),
			hasErrorBoundary: true,
		},
		{
			id: 'UserEditPage',
			Component: UserEditPage,
			path: getAdminCoreConfig(asyncNoop).routes.ADMIN_USER_EDIT,
			ErrorBoundary: () => ErrorBoundary('UserEditPage--route'),
			hasErrorBoundary: true,
		},
		{
			id: 'MaintenanceAlertsOverviewPage',
			Component: MaintenanceAlertsOverviewPage,
			path: getAdminCoreConfig(asyncNoop).routes.ADMIN_MAINTENANCE_ALERTS_OVERVIEW,
			ErrorBoundary: () => ErrorBoundary('MaintenanceAlertsOverviewPage--route'),
			hasErrorBoundary: true,
		},
	];
}

export default APP_ROUTES;
