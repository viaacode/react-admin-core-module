import { Flex, IconName } from '@viaa/avo2-components';
import { PermissionName } from '@viaa/avo2-types';
import { type FC, useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Outlet } from 'react-router';
import { AdminConfigManager, ToastType } from '~core/config';
import {
	LoadingErrorLoadedComponent,
	type LoadingInfo,
} from '~shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent.tsx';
import { CustomError } from '~shared/helpers/custom-error.ts';
import { showToast } from '~shared/helpers/show-toast.ts';
import { tHtml } from '~shared/helpers/translation-functions.ts';
import { PermissionService } from '~shared/services/permission-service.ts';
import { getMockCommonUser } from '../mock-common-user.ts';
import Sidebar from '../shared/components/Sidebar/Sidebar';
import type { NavigationItemInfo } from '../shared/types';
import { GET_NAV_ITEMS } from './admin.const';

import 'react-datepicker/dist/react-datepicker.css'; // TODO: lazy-load
import '../react-admin/modules/shared/styles/main.scss';
import './Admin.scss';

export const Admin: FC = () => {
	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({
		state: 'loading',
	});
	const [userPermissions, setUserPermissions] = useState<PermissionName[] | null>(null);
	const [navigationItems, setNavigationItems] = useState<NavigationItemInfo[] | null>(null);

	useEffect(() => {
		if (
			AdminConfigManager.isConfigSet() &&
			PermissionService.hasPerm(getMockCommonUser(), PermissionName.VIEW_ADMIN_DASHBOARD)
		) {
			const tempUserPermissions = getMockCommonUser()?.permissions || [];
			setUserPermissions(tempUserPermissions);
			GET_NAV_ITEMS(tempUserPermissions)
				.then((navItems) => {
					setNavigationItems(navItems);
				})
				.catch((err: any) => {
					console.error(new CustomError('Failed to get nav items', err));
					showToast({
						type: ToastType.ERROR,
						description: tHtml('admin/admin___het-ophalen-van-de-navigatie-items-is-mislukt'),
					});
				});
		} else {
			setLoadingInfo({
				state: 'error',
				icon: IconName.lock,
				message: tHtml(
					'admin/admin___je-hebt-geen-rechten-om-het-beheer-dashboard-te-bekijken-view-admin-dashboard'
				),
				actionButtons: ['home', 'helpdesk'],
			});
		}
	}, []);

	useEffect(() => {
		if (userPermissions && navigationItems) {
			setLoadingInfo({ state: 'loaded' });
		}
	}, [userPermissions, navigationItems]);

	const renderAdminPage = () => {
		if (!navigationItems || !userPermissions) {
			return null;
		}
		return (
			<PanelGroup
				autoSaveId="admin-dashboard"
				direction="horizontal"
				className="m-resizable-panels"
			>
				<Panel defaultSize={15}>
					<Sidebar
						headerLink={AdminConfigManager.getConfig().routes.ADMIN_DASHBOARD}
						navItems={navigationItems}
						className="o-app--admin__sidebar"
					/>
				</Panel>
				<PanelResizeHandle />
				<Panel>
					<Flex className="o-app--admin__main u-flex-auto u-scroll" orientation="vertical">
						<Outlet />
					</Flex>
				</Panel>
			</PanelGroup>
		);
	};

	return (
		<LoadingErrorLoadedComponent
			loadingInfo={loadingInfo}
			dataObject={{}}
			render={renderAdminPage}
			locationId="admin"
		/>
	);
};

export default Admin;
