import type { IPagination } from '@studiohyperdrive/pagination';
import type { Avo } from '@viaa/avo2-types';
import { stringifyUrl } from 'query-string';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { fetchWithLogoutJson } from '~modules/shared/helpers/fetch-with-logout';
import type { Locale } from '~modules/translations/translations.core.types';
import { getAdminCoreApiUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import type {
	MaintenanceAlert,
	MaintenanceAlertDto,
	MaintenanceAlertsOverviewTableCol,
} from './maintenance-alerts.types';

export class MaintenanceAlertsService {
	private static getBaseUrl(): string {
		return `${getAdminCoreApiUrl()}/admin/maintenance-alerts`;
	}

	static async fetchMaintenanceAlerts(
		searchTerm: string | undefined,
		languages: Locale[] | undefined,
		orderProp: MaintenanceAlertsOverviewTableCol = 'fromDate',
		orderDirection: Avo.Search.OrderDirection = 'asc',
		page = 0,
		size = 10
	): Promise<IPagination<MaintenanceAlert[]>> {
		try {
			return fetchWithLogoutJson(
				stringifyUrl({
					url: this.getBaseUrl(),
					query: {
						orderProp,
						orderDirection,
						page,
						size,
						searchTerm,
						languages: languages ? languages.join(',') : undefined,
					},
				})
			);
		} catch (err) {
			throw new CustomError('Failed to fetch alerts', err);
		}
	}

	public static async insertAlert(maintenanceAlert: MaintenanceAlert): Promise<void> {
		if (!maintenanceAlert) {
			return;
		}
		const data = maintenanceAlert as Partial<MaintenanceAlert>;
		delete data.id;
		return fetchWithLogoutJson(this.getBaseUrl(), {
			method: 'POST',
			body: JSON.stringify(data),
		});
	}

	static async updateAlert(
		alertId: string,
		data: MaintenanceAlertDto
	): Promise<MaintenanceAlert | void> {
		if (!data || !alertId) {
			return;
		}
		const dataTemp: Partial<MaintenanceAlert> = { ...data } as any;
		delete dataTemp.id;
		return fetchWithLogoutJson(`${this.getBaseUrl()}/${alertId}`, {
			method: 'PATCH',
			body: JSON.stringify({
				...dataTemp,
			}),
		});
	}

	static async deleteAlert(alertId: string): Promise<MaintenanceAlert | void> {
		if (!alertId) {
			return;
		}
		return fetchWithLogoutJson(`${this.getBaseUrl()}/${alertId}`, {
			method: 'DELETE',
		});
	}
}
