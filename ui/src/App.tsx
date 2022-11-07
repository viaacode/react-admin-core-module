import { Flex } from '@viaa/avo2-components';
import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route } from 'react-router-dom';

import './react-admin/modules/shared/styles/main.scss';
import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { renderAdminRoutes } from './admin.routes';
import { GET_NAV_ITEMS } from './app.const';
import { ResizablePanels } from '~modules/shared/components/ResizablePanels/ResizablePanels';
import { NavigationItemInfo } from './shared/types';
import { QueryParamProvider } from 'use-query-params';
import { useTranslation } from '~modules/shared/hooks/useTranslation';

import './App.scss';
import Sidebar from './shared/components/Sidebar/Sidebar';
import { mockUser } from './mock-user';

const queryClient = new QueryClient();

function App() {
	const [navigationItems, setNavigationItems] = useState<NavigationItemInfo[] | null>(null);

	const { tText } = useTranslation();

	useEffect(() => {
		if (!mockUser) {
			return;
		}
		GET_NAV_ITEMS()
			.then((items) => {
				setNavigationItems(items);
			})
			.catch((err) => {
				console.error(new CustomError('Failed to get nav items', err));
				AdminConfigManager.getConfig().services.toastService.showToast({
					title: tText('Error'),
					description: tText('Het ophalen van de navigatie items is mislukt'),
					type: ToastType.ERROR,
				});
			});
	}, [tText]);

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
									{renderAdminRoutes()}
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
