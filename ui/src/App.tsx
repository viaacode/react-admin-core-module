import { Flex } from '@viaa/avo2-components';
import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { BrowserRouter, Route } from 'react-router-dom';

import './react-admin/modules/shared/styles/main.scss';
import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { CustomError } from '~shared/helpers/custom-error';
import { renderAdminRoutes } from './admin.routes';
import { GET_NAV_ITEMS } from './app.const';
import { NavigationItemInfo } from './shared/types';
import { QueryParamProvider } from 'use-query-params';
import { useTranslation } from '~shared/hooks/useTranslation';
import Sidebar from './shared/components/Sidebar/Sidebar';

import './App.scss';

const queryClient = new QueryClient();

function App() {
	const [navigationItems, setNavigationItems] = useState<NavigationItemInfo[] | null>(null);

	const { tText } = useTranslation();

	useEffect(() => {
		GET_NAV_ITEMS()
			.then((items) => {
				setNavigationItems(items);
			})
			.catch((err) => {
				console.error(new CustomError('Failed to get nav items', err));
				AdminConfigManager.getConfig().services.toastService.showToast({
					title: tText('app___error'),
					description: tText('app___het-ophalen-van-de-navigatie-items-is-mislukt'),
					type: ToastType.ERROR,
				});
			});
	}, [tText]);

	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<QueryParamProvider ReactRouterRoute={Route}>
					<div className="App">
						<PanelGroup direction="horizontal">
							<Panel defaultSize={15}>
								<Sidebar
									navItems={navigationItems || undefined}
									className="o-app--admin__sidebar"
								/>
							</Panel>
							<PanelResizeHandle />
							<Panel defaultSize={85}>
								<Flex
									className="o-app--admin__main u-flex-auto u-scroll"
									orientation="vertical"
								>
									{renderAdminRoutes()}
								</Flex>
							</Panel>
						</PanelGroup>
					</div>
					{/*<Sidebar />*/}
					{/*/!*<Switch>*!/*/}
					{/*/!*{routes?.length > 0 && AdminCore.routes.render(routes)}*!/*/}
					{/*<ContentPageOverview user={mockUser} />*/}
					{/*</Switch>*/}
				</QueryParamProvider>
			</BrowserRouter>
		</QueryClientProvider>
	);
}

export default App;
