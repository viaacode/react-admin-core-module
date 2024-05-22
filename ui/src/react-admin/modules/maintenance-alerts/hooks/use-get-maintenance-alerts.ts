import { IPagination } from '@studiohyperdrive/pagination';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { MaintenanceAlertsOverviewTableState } from '~modules/maintenance-alerts/maintenance-alerts.types';
import { QUERY_KEYS } from '~modules/shared';
import { MaintenanceAlertsService } from '../maintenance-alerts.service';
import { MaintenanceAlert, MaintenanceAlertsOverviewTableCol } from '../maintenance-alerts.types';

export const useGetMaintenanceAlerts = (
	getMaintenanceAlertsArguments: Partial<MaintenanceAlertsOverviewTableState>
): UseQueryResult<IPagination<MaintenanceAlert[]>> => {
	return useQuery([QUERY_KEYS.GET_ALL_ALERTS, getMaintenanceAlertsArguments], (props) => {
		const getMaintenanceAlertsArgs = props
			.queryKey[1] as Partial<MaintenanceAlertsOverviewTableState>;

		return MaintenanceAlertsService.fetchMaintenanceAlerts(
			getMaintenanceAlertsArgs.query,
			getMaintenanceAlertsArgs.language,
			getMaintenanceAlertsArgs.sort_column as MaintenanceAlertsOverviewTableCol | undefined,
			getMaintenanceAlertsArgs.sort_order,
			getMaintenanceAlertsArgs.page
		);
	});
};
