import { IPagination } from '@studiohyperdrive/pagination';
import { Avo } from '@viaa/avo2-types';
import { stringifyUrl } from 'query-string';
import { AdminConfigManager } from '~core/config';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { fetchWithLogoutJson } from '../../../index-export';
import { Alert, AlertsOverviewTableCol } from './alerts.types';

export class AlertsService {
	private static getBaseUrl(): string {
		return `${AdminConfigManager.getConfig().database.proxyUrl}/admin/maintenance-alerts`;
	}

	static async fetchAlerts(
		orderProp: AlertsOverviewTableCol = 'fromDate',
		orderDirection: Avo.Search.OrderDirection = 'asc',
		page = 0
	): Promise<IPagination<Alert[]>> {
		try {
			return fetchWithLogoutJson(
				stringifyUrl({
					url: this.getBaseUrl(),
					query: { orderProp, orderDirection, page },
				})
			);
		} catch (err) {
			throw new CustomError('Failed to fetch alerts', err);
		}
	}
}
