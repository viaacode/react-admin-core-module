import { stringifyUrl } from 'query-string';
import { AdminConfigManager } from '~core/config';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { fetchWithLogoutJson } from '../../../index-export';

export class AlertsService {
	private static getBaseUrl(): string {
		return `${AdminConfigManager.getConfig().database.proxyUrl}/admin/maintenance-alerts`;
	}

	static async fetchAlerts(): Promise<Record<string, Record<string, string>>> {
		try {
			return fetchWithLogoutJson(
				stringifyUrl({
					url: this.getBaseUrl(),
				})
			);
		} catch (err) {
			throw new CustomError('Failed to fetch alerts', err);
		}
	}
}
