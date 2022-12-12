import { PermissionData } from '~modules/permissions/permissions.types';

import { CustomError } from '~modules/shared/helpers/custom-error';
import { fetchWithLogoutJson } from '~modules/shared/helpers/fetch-with-logout';
import { AdminConfigManager } from '~core/config';

export class PermissionService {
	private static getBaseUrl(): string {
		return `${AdminConfigManager.getConfig().database.proxyUrl}/admin/permissions`;
	}

	public static async getAllPermissions(): Promise<PermissionData[]> {
		try {
			return fetchWithLogoutJson(this.getBaseUrl());
		} catch (err) {
			throw new CustomError(`Failed to fetch navigation items`, err);
		}
	}
}
