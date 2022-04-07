import { Flex } from '@viaa/avo2-components';
import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route } from 'react-router-dom';

import './react-admin/modules/shared/styles/main.scss';
import { ContentPageOverview } from './react-admin/modules/content-page/views';
import { Sidebar } from './react-admin/modules/shared/components/Sidebar/Sidebar';
import { Config, ToastType } from './react-admin/core/config';
import { LoadingInfo } from './react-admin/modules/shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { CustomError } from './react-admin/modules/shared/helpers/custom-error';
import { PermissionService } from './react-admin/modules/shared/services/permission-service';
import { Idp, Permission } from './react-admin/modules/user/user.types';
import { renderAdminRoutes } from './admin.routes';
import { GET_NAV_ITEMS } from './app.const';
import { ResizablePanels } from './react-admin/modules/shared/components/ResizablePanels/ResizablePanels';
import { NavigationItemInfo } from './shared/types';
import { QueryParamProvider } from 'use-query-params';

const queryClient = new QueryClient();

const mockUser = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	fullName: 'Test Testers',
	email: 'test.testers@meemoo.be',
	idp: Idp.HETARCHIEF,
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	permissions: [Permission.EDIT_ANY_CONTENT_PAGES, Permission.VIEW_ADMIN_DASHBOARD],
};

function App() {
	// const [routes] = useModuleRoutes(false);
	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });
	const [userPermissions, setUserPermissions] = useState<Permission[] | null>(null);
	const [navigationItems, setNavigationItems] = useState<NavigationItemInfo[] | null>(null);

	useEffect(() => {
		if (!mockUser) {
			return;
		}
		if (PermissionService.hasPerm(mockUser, Permission.VIEW_ADMIN_DASHBOARD)) {
			const tempUserPermissions = PermissionService.getUserPermissions(mockUser);
			setUserPermissions(tempUserPermissions);
			GET_NAV_ITEMS(tempUserPermissions)
				.then(setNavigationItems)
				.catch((err) => {
					console.error(new CustomError('Failed to get nav items', err));
					Config.getConfig().services.toastService.showToast({
						title: Config.getConfig().services.i18n.t('Error'),
						description: Config.getConfig().services.i18n.t(
							'Het ophalen van de navigatie items is mislukt'
						),
						type: ToastType.ERROR,
					});
				});
		} else {
			setLoadingInfo({
				state: 'error',
				icon: 'lock',
				message: Config.getConfig().services.i18n.t(
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
	}, [mockUser, setLoadingInfo]);

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
									{!!userPermissions && renderAdminRoutes(userPermissions)}
								</Flex>
							</ResizablePanels>
						</div>
						<Sidebar />
						{/*<Switch>*/}
						{/*{routes?.length > 0 && AdminCore.routes.render(routes)}*/}
						<ContentPageOverview user={mockUser} />
						{/*</Switch>*/}
					</div>
				</QueryParamProvider>
			</BrowserRouter>
		</QueryClientProvider>
	);
}

export default App;

