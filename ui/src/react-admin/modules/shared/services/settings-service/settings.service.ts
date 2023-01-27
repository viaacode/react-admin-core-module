import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';

import { AdminConfigManager } from '~core/config';

export class SettingsService {
	private static getBaseUrl(): string {
		return `${AdminConfigManager.getConfig().database.proxyUrl}/admin/lookup`;
	}

	public static async fetchSubjects(): Promise<string[]> {
		return fetchWithLogoutJson(this.getBaseUrl() + '/subjects');
	}

	public static async fetchEducationLevels(): Promise<string[]> {
		return fetchWithLogoutJson(this.getBaseUrl() + '/education-levels');
	}
}
