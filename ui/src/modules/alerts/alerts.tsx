import type { ReactNode } from 'react';
import { Route } from 'react-router';
import { ALERTS_PATH } from '~modules/maintenance-alerts/maintenance-alerts.const';
import { MaintenanceAlertsOverviewPage } from './MaintenanceAlertsOverviewPage';

export const renderAdminAlertsRoutes = (): ReactNode[] => [
	<Route
		key={ALERTS_PATH.ALERTS}
		render={() => <MaintenanceAlertsOverviewPage />}
		exact
		path={ALERTS_PATH.ALERTS}
	/>,
];
