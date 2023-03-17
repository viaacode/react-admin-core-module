import { IPagination } from '@studiohyperdrive/pagination';
import { Avo } from '@viaa/avo2-types';
import { stringifyUrl } from 'query-string';
import { AdminConfigManager } from '~core/config';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { fetchWithLogoutJson } from '~modules/shared/helpers/fetch-with-logout';
import { Alert, AlertFormState, AlertsOverviewTableCol } from './alerts.types';

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

	public static async insertAlert(data: AlertFormState): Promise<void> {
		if (!data) {
			return;
		}
		return fetchWithLogoutJson(this.getBaseUrl(), {
			method: 'POST',
			body: JSON.stringify({
				...data,
			}),
		});
	}

	static async updateAlert(alertId: string, data: AlertFormState): Promise<Alert | void> {
		if (!data || !alertId) {
			return;
		}
		return fetchWithLogoutJson(`${this.getBaseUrl()}/${alertId}`, {
			method: 'PATCH',
			body: JSON.stringify({
				...data,
			}),
		});
	}

	static async deleteAlert(alertId: string): Promise<Alert | void> {
		if (!alertId) {
			return;
		}
		return fetchWithLogoutJson(`${this.getBaseUrl()}/${alertId}`, {
			method: 'DELETE',
		});
	}
}
