import { InternalServerErrorException, Logger, type LoggerService } from '@nestjs/common';
import type { Avo } from '@viaa/avo2-types';
import { addDays, getHours, setHours, setMilliseconds, setMinutes, setSeconds } from 'date-fns/fp';
import { get } from 'lodash';
import flow from 'lodash/fp/flow';

import { mockUserAvo, mockUserHetArchief } from '../../../mock-user';
import { isAvo } from '../helpers/is-avo';
import { SpecialPermissionGroups } from '../types/types';

import { Idp, type LdapUser } from './auth.types';

const IDP = 'idp';
const IDP_USER_INFO_PATH = 'idpUserInfo';
export const ARCHIEF_USER_INFO_PATH = 'archiefUserInfo';
export const AVO_USER_INFO_PATH = 'avoUserInfo';

export class SessionHelper {
	private static logger: LoggerService = new Logger(SessionHelper.name);

	public static setLogger(newLogger: LoggerService): void {
		SessionHelper.logger = newLogger;
	}

	public static ensureValidSession(session: Record<string, any>) {
		if (!session) {
			SessionHelper.logger.error('Failed to set Idp user info, no session was found');
			throw new InternalServerErrorException();
		}
	}

	public static isIdpUserSessionValid(session: Record<string, any>): boolean {
		const expiresOn = new Date(
			get(session[IDP_USER_INFO_PATH], 'session_not_on_or_after', 0)
		).getTime();
		return Date.now() <= expiresOn;
	}

	/**
	 * @param session
	 * @returns if the user is logged in, regardless of the IDP
	 */
	public static isLoggedIn(session: Record<string, any>): boolean {
		if (!session) {
			return false;
		}

		return !!(
			(
				Idp[session[IDP]] && // IDP is set and known
				session[IDP_USER_INFO_PATH] && // IDP user is set
				SessionHelper.isIdpUserSessionValid(session) && // IDP session is valid
				(session[ARCHIEF_USER_INFO_PATH] || session[AVO_USER_INFO_PATH])
			) // Archief user is set
		);
	}

	/**
	 * @param idp
	 * @param session
	 * @returns if the user is logged in with the given idp
	 */
	public static isLoggedInWithIdp(idp: Idp, session: Record<string, any>) {
		return SessionHelper.isLoggedIn(session) && session[IDP] === idp;
	}

	/**
	 * Set IDP user info on the session
	 * @param session
	 * @param idp
	 * @param user
	 */
	public static setIdpUserInfo(session: Record<string, any>, idp: Idp, user: LdapUser): void {
		SessionHelper.ensureValidSession(session);
		session[IDP] = idp;
		session[IDP_USER_INFO_PATH] = user;
	}

	/**
	 * Set archief user info (our user object) on the session
	 * @param session
	 * @param user
	 */
	public static setArchiefUserInfo(
		session: Record<string, any>,
		user: Avo.User.HetArchiefUser
	): void {
		SessionHelper.ensureValidSession(session);
		session[ARCHIEF_USER_INFO_PATH] = user;
	}

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

	/**
	 * Returns when the session expires based on the input date (usually 'now')
	 */
	public static getExpiresAt(now: Date): string {
		const expiresAt = flow(
			getHours(now) > 5 ? addDays(1) : addDays(0), // after 5am session expires at 5am the next day
			setHours(5),
			setMinutes(0),
			setSeconds(0),
			setMilliseconds(0)
		)(now);

		return expiresAt.toISOString();
	}

	public static getIdpUserInfo(session: Record<string, any>): LdapUser | null {
		if (!session) {
			return null;
		}
		return session[IDP_USER_INFO_PATH];
	}

	public static getIdp(session: Record<string, any>): Idp | null {
		if (!session) {
			return null;
		}
		return session[IDP];
	}

	/**
	 * Logout by removing all user info from the session
	 * @param session
	 */
	public static logout(session: Record<string, any>) {
		session[IDP] = null;
		session[IDP_USER_INFO_PATH] = null;
		session[ARCHIEF_USER_INFO_PATH] = null;
	}
}
