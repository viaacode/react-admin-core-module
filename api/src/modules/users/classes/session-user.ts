import type { Avo } from '@viaa/avo2-types';
import { PermissionName } from '@viaa/avo2-types';
import { isAvo } from '../../shared/helpers/is-avo';
import { SpecialPermissionGroups } from '../../shared/types/types';
import { convertUserInfoToCommonUser } from '../users.converters';

import { CommonUser, HetArchiefUser, UserInfoType } from '../users.types';

export class SessionUserEntity {
	protected user: CommonUser | undefined;
	protected originalUser: HetArchiefUser | Avo.User.User;

	public constructor(user: HetArchiefUser | Avo.User.User | undefined) {
		this.originalUser = user;
		this.user = convertUserInfoToCommonUser(
			user,
			isAvo() ? UserInfoType.AvoUserUser : UserInfoType.HetArchiefUser,
		);
	}

	public getUser(): CommonUser {
		return this.user;
	}

	public getId(): string {
		return this.user.userId;
	}

	public getProfileId(): string {
		return this.user.profileId;
	}

	public getFirstName(): string {
		return this.user.firstName;
	}

	public getLastName(): string {
		return this.user.lastName;
	}

	public getFullName(): string {
		return this.user.fullName;
	}

	public getMail(): string {
		return this.user.email;
	}

	/**
	 * Returns the single user group id that the user is part of. eg: 'f7b99395-36f3-4be2-9fb1-31197509e16b' or 3
	 * avo: number
	 * hetarchief: string (uuid)
	 */
	public getGroupId(): string | number {
		return this.user?.userGroup?.id;
	}

	/**
	 * Returns both the usergroup id of the current user and also the special user group the user is part of: loggedInUsers / loggedOutUsers
	 */
	public getGroupIds(): (string | number)[] {
		return [
			...(this.getGroupId() ? [this.getGroupId()] : []),
			this.getGroupId()
				? SpecialPermissionGroups.loggedInUsers
				: SpecialPermissionGroups.loggedOutUsers,
		];
	}

	public getMaintainerId(): string {
		return (this.originalUser as HetArchiefUser)?.maintainerId;
	}

	public getVisitorSpaceSlug(): string {
		return (this.originalUser as HetArchiefUser)?.visitorSpaceSlug;
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
