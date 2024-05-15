import { ReactNode } from 'react';
import { Route } from 'react-router';
import { ALERTS_PATH } from '~modules/maintenance-alerts/maintenance-alerts.const';
import { AlertsOverviewPage } from './AlertsOverViewPage';

export const renderAdminAlertsRoutes = (): ReactNode[] => [
	<Route
		key={ALERTS_PATH.ALERTS}
		render={() => <AlertsOverviewPage />}
		exact
		path={ALERTS_PATH.ALERTS}
	/>,
];
