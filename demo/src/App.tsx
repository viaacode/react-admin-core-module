import { Flex } from '@viaa/avo2-components';
import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route } from 'react-router-dom';

import './react-admin/modules/shared/styles/main.scss';
import { CommonUser } from '~modules/user/user.types';
import { Config, ToastType } from '~core/config';
import { LoadingInfo } from '~modules/shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { PermissionService } from '~modules/shared/services/permission-service';
import { Idp, Permission } from '~modules/user/user.types';
import { renderAdminRoutes } from './admin.routes';
import { GET_NAV_ITEMS } from './app.const';
import { ResizablePanels } from '~modules/shared/components/ResizablePanels/ResizablePanels';
import { NavigationItemInfo } from './shared/types';
import { QueryParamProvider } from 'use-query-params';
import { useTranslation } from '~modules/shared/hooks/useTranslation';

import './App.scss';
import Sidebar from './shared/components/Sidebar/Sidebar';

const queryClient = new QueryClient();

const mockUser: CommonUser = {
	profileId: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	fullName: 'Test Testers',
	email: 'test.testers@meemoo.be',
	idp: Idp.HETARCHIEF,
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	permissions: [
		Permission.VIEW_ADMIN_DASHBOARD,
		Permission.EDIT_ANY_CONTENT_PAGES,
		Permission.EDIT_CONTENT_PAGE_LABELS,
		Permission.CREATE_CONTENT_PAGES,
		Permission.CAN_READ_ALL_VISIT_REQUESTS,
		Permission.CAN_APPROVE_DENY_ALL_VISIT_REQUESTS,
		Permission.CAN_READ_CP_VISIT_REQUESTS,
		Permission.CAN_APPROVE_DENY_CP_VISIT_REQUESTS,
		Permission.CAN_READ_PERSONAL_APPROVED_VISIT_REQUESTS,
		Permission.EDIT_ANY_CONTENT_PAGES,
		Permission.EDIT_OWN_CONTENT_PAGES,
		Permission.SEARCH,
		Permission.EDIT_PROTECTED_PAGE_STATUS,
		Permission.EDIT_CONTENT_PAGE_AUTHOR,
		Permission.VIEW_ANY_PUBLISHED_ITEMS,
		Permission.DELETE_ANY_CONTENT_PAGES,
		Permission.CREATE_CONTENT_PAGES,
		Permission.EDIT_OWN_COLLECTIONS,
		Permission.PUBLISH_OWN_COLLECTIONS,
		Permission.VIEW_OWN_COLLECTIONS,
		Permission.EDIT_OWN_BUNDLES,
		Permission.PUBLISH_OWN_BUNDLES,
		Permission.VIEW_OWN_BUNDLES,
		Permission.EDIT_OWN_ASSIGNMENTS,
		Permission.EDIT_ASSIGNMENTS,
		Permission.DELETE_OWN_BUNDLES,
		Permission.DELETE_OWN_COLLECTIONS,
		Permission.PUBLISH_ANY_CONTENT_PAGE,
		Permission.UNPUBLISH_ANY_CONTENT_PAGE,
		Permission.VIEW_ADMIN_DASHBOARD,
		Permission.EDIT_TRANSLATIONS,
	],
};

function App() {
	// const [routes] = useModuleRoutes(false);
	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });
	const [userPermissions, setUserPermissions] = useState<Permission[] | null>(null);
	const [navigationItems, setNavigationItems] = useState<NavigationItemInfo[] | null>(null);

	const { t } = useTranslation();

	useEffect(() => {
		if (!mockUser) {
			return;
		}
		if (PermissionService.hasPerm(mockUser, Permission.VIEW_ADMIN_DASHBOARD)) {
			const tempUserPermissions = PermissionService.getUserPermissions(mockUser);
			setUserPermissions(tempUserPermissions);
			GET_NAV_ITEMS(tempUserPermissions)
				.then((items) => {
					setNavigationItems(items);
				})
				.catch((err) => {
					console.error(new CustomError('Failed to get nav items', err));
					Config.getConfig().services.toastService.showToast({
						title: t('Error'),
						description: t('Het ophalen van de navigatie items is mislukt'),
						type: ToastType.ERROR,
					});
				});
		} else {
			setLoadingInfo({
				state: 'error',
				icon: 'lock',
				message: t(
					'admin/admin___je-hebt-geen-rechten-om-het-beheer-dashboard-te-bekijken-view-admin-dashboard'
				),
				actionButtons: ['home', 'helpdesk'],
			});
		}

		// Remove zendesk when loading beheer after visiting the client side of the app
		const zendeskWidget = document.querySelector('iframe#launcher');
		if (zendeskWidget) {
			zendeskWidget.remove();
		}
	}, [setLoadingInfo, t]);

	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<QueryParamProvider ReactRouterRoute={Route}>
					<div className="App">
						<div className="m-resizable-panels">
							<ResizablePanels
								displayDirection="row"
								panelsSize={[300]}
								sizeUnitMeasure="px"
								resizerSize="15px"
							>
								<Sidebar
									navItems={navigationItems || undefined}
									className="o-app--admin__sidebar"
								/>
								<Flex
									className="o-app--admin__main u-flex-auto u-scroll"
									orientation="vertical"
								>
									{renderAdminRoutes(mockUser)}
								</Flex>
							</ResizablePanels>
						</div>
						{/*<Sidebar />*/}
						{/*/!*<Switch>*!/*/}
						{/*/!*{routes?.length > 0 && AdminCore.routes.render(routes)}*!/*/}
						{/*<ContentPageOverview user={mockUser} />*/}
						{/*</Switch>*/}
					</div>
				</QueryParamProvider>
			</BrowserRouter>
		</QueryClientProvider>
	);
}

export default App;

