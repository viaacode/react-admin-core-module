import { Flex } from '@viaa/avo2-components';
import { isNil } from 'es-toolkit';
import React, { useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useNavigate } from 'react-router';
import { ToastType } from '~core/config/config.types';
import { CenteredSpinner } from '~shared/components/Spinner/CenteredSpinner';
import { CustomError } from '~shared/helpers/custom-error';
import { showToast } from '~shared/helpers/show-toast';
import { tText } from '~shared/helpers/translation-functions';
import { renderAdminRoutes } from './admin.routes';
import { GET_NAV_ITEMS } from './app.const';
import Sidebar from './shared/components/Sidebar/Sidebar';
import { setAdminCoreConfig } from './shared/helpers/admin-core-config';
import type { NavigationItemInfo } from './shared/types';
import './react-admin/modules/shared/styles/main.scss';
import './App.scss';

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
				<PanelGroup
					autoSaveId="admin-dashboard"
					direction="horizontal"
					className="m-resizable-panels"
				>
					<Panel defaultSize={15}>
						<Sidebar navItems={navigationItems || undefined} className="o-app--admin__sidebar" />
					</Panel>
					<PanelResizeHandle />
					<Panel>
						<Flex
							className="o-app--admin__main u-flex-auto u-scroll c-scrollable"
							orientation="vertical"
						>
							{renderAdminRoutes()}
						</Flex>
					</Panel>
				</PanelGroup>
			</div>
		);
	};

	return renderApp();
}

export default App;
