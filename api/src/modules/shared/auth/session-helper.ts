import type { Avo } from '@viaa/avo2-types';

import { mockUserAvo, mockUserHetArchief } from '../../../mock-user';
import { isAvo } from '../helpers/is-avo';
import { SpecialPermissionGroups } from '../types/types';

export const ARCHIEF_USER_INFO_PATH = 'archiefUserInfo';
export const AVO_USER_INFO_PATH = 'avoUserInfo';

export class SessionHelper {
	public static getUserInfo(
		session: Record<string, any>
	): Avo.User.HetArchiefUser | Avo.User.User | null {
		/** Login user for admin-core demo app */
		if (process.env.IS_ADMIN_CORE_DEMO_APP === 'true') {
			if (isAvo()) {
				return mockUserAvo;
			} else {
				return mockUserHetArchief;
			}
		}

		if (!session) {
			return null;
		}
		return session[ARCHIEF_USER_INFO_PATH] || session[AVO_USER_INFO_PATH];
	}

	public static getUserGroupIds(groupId: string | number | undefined): string[] {
		return [
			...(groupId ? [String(groupId)] : []),
			groupId
				? SpecialPermissionGroups.loggedInUsers
				: SpecialPermissionGroups.loggedOutUsers,
		];
	}
}
