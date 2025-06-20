import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';

import { getAdminCoreApiUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';

export class SettingsService {
	private static getBaseUrl(): string {
		return `${getAdminCoreApiUrl()}/admin/lookup`;
	}

	public static async fetchSubjects(): Promise<string[]> {
		return fetchWithLogoutJson(`${SettingsService.getBaseUrl()}/subjects`);
	}

	public static async fetchEducationLevels(): Promise<string[]> {
		return fetchWithLogoutJson(`${SettingsService.getBaseUrl()}/education-levels-and-degrees`);
	}
}
