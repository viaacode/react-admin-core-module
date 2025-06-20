import { stringifyUrl } from 'query-string';

import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getAdminCoreApiUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import type {
	UserGroup,
	UserGroupUpdates,
	UserGroupWithPermissions,
} from '../types/user-group.types';

export class UserGroupService {
	private static getBaseUrl(): string {
		return `${getAdminCoreApiUrl()}/admin/user-groups`;
	}

	public static async fetchUserGroupsWithPermissions(): Promise<UserGroupWithPermissions[]> {
		const userGroups = await fetchWithLogoutJson<UserGroupWithPermissions[]>(
			stringifyUrl({
				url: UserGroupService.getBaseUrl(),
				query: {
					withPermissions: 'true',
				},
			}),
			{ throwOnNullResponse: true }
		);
		userGroups.map((userGroup) => (userGroup.id = String(userGroup.id)));
		return userGroups;
	}

	public static async fetchUserGroups(): Promise<UserGroup[]> {
		const userGroups = await fetchWithLogoutJson<UserGroup[]>(
			stringifyUrl({
				url: UserGroupService.getBaseUrl(),
				query: {
					withPermissions: 'false',
				},
			}),
			{ throwOnNullResponse: true }
		);
		userGroups.map((userGroup) => (userGroup.id = String(userGroup.id)));
		return userGroups;
	}

	public static async updateUserGroups(
		userGroupUpdates: UserGroupUpdates
	): Promise<{ deleted: number; updated: number }> {
		return fetchWithLogoutJson(UserGroupService.getBaseUrl(), {
			method: 'PATCH',
			body: JSON.stringify(userGroupUpdates),
		});
	}
}
