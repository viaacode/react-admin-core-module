import { IPagination } from '@studiohyperdrive/pagination';
import type { Avo } from '@viaa/avo2-types';
import { stringifyUrl } from 'query-string';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { fetchWithLogoutJson } from '~modules/shared/helpers/fetch-with-logout';
import { LanguageCode } from '~modules/translations/translations.core.types';
import { getAdminCoreApiUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import {
	MaintenanceAlert,
	MaintenanceAlertDto,
	MaintenanceAlertFormState,
	MaintenanceAlertsOverviewTableCol,
} from './maintenance-alerts.types';

export class MaintenanceAlertsService {
	private static getBaseUrl(): string {
		return `${getAdminCoreApiUrl()}/admin/maintenance-alerts`;
	}

	static async fetchMaintenanceAlerts(
		searchTerm: string | undefined,
		language: LanguageCode[] | undefined,
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
						language: language ? language.join(',') : undefined,
					},
				})
			);
		} catch (err) {
			throw new CustomError('Failed to fetch alerts', err);
		}
	}

	public static async insertAlert(data: MaintenanceAlertFormState): Promise<void> {
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

	static async updateAlert(
		alertId: string,
		data: MaintenanceAlertDto
	): Promise<MaintenanceAlert | void> {
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

	static async deleteAlert(alertId: string): Promise<MaintenanceAlert | void> {
		if (!alertId) {
			return;
		}
		return fetchWithLogoutJson(`${this.getBaseUrl()}/${alertId}`, {
			method: 'DELETE',
		});
	}
}
