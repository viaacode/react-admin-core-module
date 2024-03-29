import { Flex } from '@viaa/avo2-components';
import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HorizontalPageSplit, VerticalPageSplit } from 'react-page-split';
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
						<HorizontalPageSplit widths={['15%', '85%']}>
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
						</HorizontalPageSplit>
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
