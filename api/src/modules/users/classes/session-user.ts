import type { Avo } from '@viaa/avo2-types';
import { get } from 'lodash';
import { PermissionName } from '@viaa/avo2-types';

import { HetArchiefUser } from '../users.types';

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

	public getGroupId(): string | number {
		return (
			(this.user as HetArchiefUser)?.groupId ||
			((this.user as Avo.User.User)?.profile?.userGroupIds?.[0] as number)
		);
	}

	public getMaintainerId(): string {
		return get(this.user, 'maintainerId');
	}

	public getVisitorSpaceSlug(): string {
		return get(this.user, 'visitorSpaceSlug');
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
