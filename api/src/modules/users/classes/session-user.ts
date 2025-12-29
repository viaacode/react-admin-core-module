import type {
	AvoUserCommonUser,
	AvoUserHetArchiefUser,
	AvoUserUser,
	PermissionName,
} from '@viaa/avo2-types';

import { isAvo } from '../../shared/helpers/is-avo';
import { SpecialPermissionGroups } from '../../shared/types/types';
import type { Locale } from '../../translations';
import { convertUserInfoToCommonUser } from '../users.converters';
import { UserInfoType } from '../users.types';

export class SessionUserEntity {
	protected user: AvoUserCommonUser | undefined;
	protected originalUser: AvoUserHetArchiefUser | AvoUserUser;

	public constructor(user: AvoUserHetArchiefUser | AvoUserUser | undefined) {
		this.originalUser = user;
		this.user = convertUserInfoToCommonUser(
			user,
			isAvo() ? UserInfoType.AvoUserUser : UserInfoType.HetArchiefUser
		);
	}

	public getUser(): AvoUserCommonUser {
		return this.user;
	}

	public getId(): string {
		return this.user?.userId;
	}

	public getProfileId(): string {
		return this.user?.profileId;
	}

	public getLanguage(): Locale | undefined {
		return this.user?.language as Locale | undefined;
	}

	public getFirstName(): string {
		return this.user?.firstName;
	}

	public getLastName(): string {
		return this.user?.lastName;
	}

	public getFullName(): string {
		return this.user?.fullName;
	}

	public getMail(): string {
		return this.user?.email;
	}

	/**
	 * Returns the single user group id that the user is part of. eg: 'f7b99395-36f3-4be2-9fb1-31197509e16b' or 3
	 * avo: number
	 * hetarchief: string (uuid)
	 */
	public getGroupId(): string {
		return this.user?.userGroup?.id ? String(this.user?.userGroup?.id) : undefined;
	}

	/**
	 * Returns both the usergroup id of the current user and also the special user group the user is part of: loggedInUsers / loggedOutUsers
	 */
	public getGroupIds(): string[] {
		return [
			...(this.getGroupId() ? [this.getGroupId()] : []),
			this.getGroupId()
				? SpecialPermissionGroups.loggedInUsers
				: SpecialPermissionGroups.loggedOutUsers,
		].map((group) => String(group));
	}

	public getMaintainerId(): string {
		return (this.originalUser as AvoUserHetArchiefUser)?.maintainerId;
	}

	public getVisitorSpaceSlug(): string {
		return (this.originalUser as AvoUserHetArchiefUser)?.visitorSpaceSlug;
	}

	public has(permission: PermissionName): boolean {
		return this.user?.permissions?.includes(permission) || false;
	}

	public hasNot(permission: PermissionName): boolean {
		return !this.has(permission);
	}

	public hasAny(permissions: PermissionName[]): boolean {
		if (permissions.length === 0) {
			return true;
		}

		return permissions.some((permission) => this.has(permission));
	}

	public hasAll(permissions: PermissionName[]): boolean {
		if (permissions.length === 0) {
			return true;
		}

		return permissions.every((permission) => this.has(permission));
	}
}
