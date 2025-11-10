import { Flex } from '@viaa/avo2-components';
import React, { useEffect, useState } from 'react';
import { HorizontalPageSplit } from 'react-page-split';

import { useNavigate } from 'react-router';
import { ToastType } from '~core/config/config.types.js';
import { CenteredSpinner } from '~shared/components/Spinner/CenteredSpinner.js';
import { CustomError } from '~shared/helpers/custom-error.js';
import { showToast } from '~shared/helpers/show-toast.js';
import { tText } from '~shared/helpers/translation-functions.js';
import { renderAdminRoutes } from './admin.routes.js';
import { GET_NAV_ITEMS } from './app.const.js';
import Sidebar from './shared/components/Sidebar/Sidebar.js';
import { setAdminCoreConfig } from './shared/helpers/admin-core-config.js';
import type { NavigationItemInfo } from './shared/types/index.js';
import './react-admin/modules/shared/styles/main.scss';
import './App.scss';
import { isNil } from 'es-toolkit';

function App() {
	const [navigationItems, setNavigationItems] = useState<NavigationItemInfo[] | null>(null);
	const [isAdminCoreConfigLoaded, setIsAdminCoreConfigLoaded] = useState(false);
	const navigateFunc = useNavigate();

	/**
	 * Set admin core config
	 */
	useEffect(() => {
		setAdminCoreConfig(navigateFunc);
		setIsAdminCoreConfigLoaded(true);
	}, [navigateFunc]);

	/**
	 * Load navigation items
	 */
	useEffect(() => {
		if (isAdminCoreConfigLoaded) {
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
		}
	}, [isAdminCoreConfigLoaded]);

	const renderApp = () => {
		if (!isAdminCoreConfigLoaded || isNil(navigationItems)) {
			return <CenteredSpinner />;
		}
		return (
			<div className="App">
				<HorizontalPageSplit widths={['15%', '85%']}>
					<Sidebar navItems={navigationItems || undefined} className="o-app--admin__sidebar" />

					<Flex
						className="o-app--admin__main u-flex-auto u-scroll c-scrollable"
						orientation="vertical"
					>
						{renderAdminRoutes()}
					</Flex>
				</HorizontalPageSplit>
			</div>
		);
	};

	return renderApp();
}

export default App;
