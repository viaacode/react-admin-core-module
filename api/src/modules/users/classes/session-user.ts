import type { Avo } from '@viaa/avo2-types';
import { PermissionName } from '@viaa/avo2-types';
import { SpecialPermissionGroups } from "../../shared/types/types";
import { convertUserInfoToCommonUser } from "../users.converters";

import { CommonUser, HetArchiefUser } from "../users.types";

export class SessionUserEntity {
	protected user: HetArchiefUser | Avo.User.User | undefined;
	protected permissions: Array<PermissionName>;

	public constructor(user: HetArchiefUser | Avo.User.User | undefined) {
		this.user = user;
		// can be archief-user or avo-user, where permissions are stored differently
		// merge them into 1 unified array
		this.permissions = [
			...((this.user as HetArchiefUser)?.permissions || []),
			...((this.user as Avo.User.User)?.profile?.permissions || []),
		] as PermissionName[];
	}

	public getUser(): HetArchiefUser | Avo.User.User {
		return this.user;
	}

	public getCommonUser(): CommonUser {
		return convertUserInfoToCommonUser(this.user);
	}

	public getId(): string {
		return (
			(this.user as HetArchiefUser)?.id || (this.user as Avo.User.User)?.uid
		);
	}

	public getFirstName(): string {
		return (
			(this.user as HetArchiefUser)?.firstName ||
			(this.user as Avo.User.User)?.first_name
		);
	}

	public getLastName(): string {
		return (
			(this.user as HetArchiefUser)?.lastName ||
			(this.user as Avo.User.User)?.last_name
		);
	}

	public getFullName(): string {
		return (
			(this.user as HetArchiefUser)?.fullName ||
			(this.user as Avo.User.User)?.full_name
		);
	}

	public getMail(): string {
		return (
			(this.user as HetArchiefUser)?.email || (this.user as Avo.User.User)?.mail
		);
	}

	/**
	 * Returns the single user group id that the user is part of. eg: 'f7b99395-36f3-4be2-9fb1-31197509e16b' or 3
	 * avo: number
	 * hetarchief: string (uuid)
	 */
	public getGroupId(): string | number {
		return (
			(this.user as HetArchiefUser)?.groupId ||
			((this.user as Avo.User.User)?.profile?.userGroupIds?.[0] as number)
		);
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
		return (this.user as HetArchiefUser)?.maintainerId;
	}

	public getVisitorSpaceSlug(): string {
		return (this.user as HetArchiefUser)?.visitorSpaceSlug;
	}

	public has(permission: PermissionName): boolean {
		return this.permissions.includes(permission);
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
