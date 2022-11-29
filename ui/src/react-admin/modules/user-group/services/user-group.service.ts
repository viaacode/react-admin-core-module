import { stringifyUrl } from 'query-string';

import { AdminConfigManager } from '~core/config';
import { fetchWithLogoutJson } from '~modules/shared/helpers/fetch-with-logout';
import { UserGroup, UserGroupUpdates, UserGroupWithPermissions } from '../types/user-group.types';

export class UserGroupService {
	private static getBaseUrl(): string {
		return `${AdminConfigManager.getConfig().database.proxyUrl}/user-groups`;
	}

	public static async fetchUserGroupsWithPermissions(): Promise<UserGroupWithPermissions[]> {
		return fetchWithLogoutJson(
			stringifyUrl({
				url: this.getBaseUrl(),
				query: {
					withPermissions: 'true',
				},
			})
		);
	}

	public static async fetchUserGroups(): Promise<UserGroup[]> {
		return fetchWithLogoutJson(
			stringifyUrl({
				url: this.getBaseUrl(),
				query: {
					withPermissions: 'false',
				},
			})
		);
	}

	public static async updateUserGroups(
		userGroupUpdates: UserGroupUpdates
	): Promise<{ deleted: number; updated: number }> {
		return fetchWithLogoutJson(this.getBaseUrl(), {
			method: 'PATCH',
			body: JSON.stringify(userGroupUpdates),
		});
	}
}
