/** biome-ignore-all lint/complexity/noStaticOnlyClass: handy for session user handling */
import type { AvoUserHetArchiefUser, AvoUserUser } from '@viaa/avo2-types';
import type { Request } from 'express';
import { get } from 'lodash';
import { getMockUserAvo, getMockUserHetArchief } from '../../../mock-user';
import { isAvo } from '../helpers/is-avo';
import { SpecialPermissionGroups } from '../types/types';

export const ARCHIEF_USER_INFO_PATH = 'archiefUserInfo';
export const AVO_USER_INFO_PATH = 'avoUserInfo';
export const LTI_AVO_USER_INFO_PATH = `lti.${AVO_USER_INFO_PATH}`;
export const LTI_JWT_TOKEN_HEADER = 'lti-jwt-token';

export class SessionHelper {
	public static getUserInfo(request: Request): AvoUserHetArchiefUser | AvoUserUser | null {
		/** Login user for admin-core demo app */
		if (process.env.IS_ADMIN_CORE_DEMO_APP === 'true') {
			if (isAvo()) {
				return getMockUserAvo();
			} else {
				return getMockUserHetArchief();
			}
		}

		// biome-ignore lint/suspicious/noExplicitAny: todo
		const session = (request as any).session;

		if (!session) {
			return null;
		}

		if (request.headers[LTI_JWT_TOKEN_HEADER]) {
			return get(session, LTI_AVO_USER_INFO_PATH);
		}

		return session[ARCHIEF_USER_INFO_PATH] || session[AVO_USER_INFO_PATH];
	}

	public static getUserGroupIds(groupId: string | number | undefined): string[] {
		return [
			...(groupId ? [String(groupId)] : []),
			groupId ? SpecialPermissionGroups.loggedInUsers : SpecialPermissionGroups.loggedOutUsers,
		];
	}
}
