import { Flex } from '@viaa/avo2-components';
import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HorizontalPageSplit } from 'react-page-split';
import { BrowserRouter, Route } from 'react-router-dom';

import './react-admin/modules/shared/styles/main.scss';
import { ToastType } from '~core/config/config.types';
import { CustomError } from '~shared/helpers/custom-error';
import { showToast } from '~shared/helpers/show-toast';
import { renderAdminRoutes } from './admin.routes';
import { GET_NAV_ITEMS } from './app.const';
import type { NavigationItemInfo } from './shared/types';
import { QueryParamProvider } from 'use-query-params';
import { tText } from '~shared/helpers/translation-functions';
import Sidebar from './shared/components/Sidebar/Sidebar';

import './App.scss';

const queryClient = new QueryClient();

function App() {
	const [navigationItems, setNavigationItems] = useState<NavigationItemInfo[] | null>(null);

	useEffect(() => {
		GET_NAV_ITEMS()
			.then((items) => {
				setNavigationItems(items);
			})
			.catch((err) => {
				console.error(new CustomError('Failed to get nav items', err));
				showToast({
					title: tText('app___error'),
					description: tText('app___het-ophalen-van-de-navigatie-items-is-mislukt'),
					type: ToastType.ERROR,
				});
			});
	}, []);

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
								className="o-app--admin__main u-flex-auto u-scroll c-scrollable"
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
