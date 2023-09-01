import { IPagination } from '@studiohyperdrive/pagination';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { Avo } from '@viaa/avo2-types';
import { QUERY_KEYS } from '~modules/shared';
import { AlertsService } from '../alerts.service';
import { Alert, AlertsOverviewTableCol } from '../alerts.types';

export interface GetAlertsArguments {
	orderProp?: AlertsOverviewTableCol;
	orderDirection?: Avo.Search.OrderDirection;
	page?: number;
}

export const useGetAlerts = (
	getAlertsArguments: GetAlertsArguments
): UseQueryResult<IPagination<Alert[]>> => {
	return useQuery([QUERY_KEYS.GET_ALL_ALERTS, getAlertsArguments], (props) => {
		const getAlertArgs = props.queryKey[1] as GetAlertsArguments;

		if (!getAlertArgs) {
			return null;
		}

		return AlertsService.fetchAlerts(
			getAlertArgs.orderProp,
			getAlertArgs.orderDirection,
			getAlertArgs.page
		);
	});
};
