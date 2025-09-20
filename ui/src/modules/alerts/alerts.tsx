import type {ReactNode} from 'react';
import {Route} from 'react-router';
import {AdminConfigManager} from '~core/config';
import {MaintenanceAlertsOverviewPage} from './MaintenanceAlertsOverviewPage';

export const renderAdminAlertsRoutes = (): ReactNode[] => [
	<Route
		path={AdminConfigManager.getAdminRoute('ADMIN_ALERTS_OVERVIEW')}
		Component={MaintenanceAlertsOverviewPage}
		key={AdminConfigManager.getAdminRoute('ADMIN_ALERTS_OVERVIEW')}
	/>,
];
