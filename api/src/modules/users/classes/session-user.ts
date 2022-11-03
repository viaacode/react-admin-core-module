import { Logger } from "@nestjs/common";
import { Avo } from "@viaa/avo2-types";
import { get } from "lodash";

import { HetArchiefUser, Permission } from "../types";

export class SessionUserEntity {
	private logger = new Logger(SessionUserEntity.name, { timestamp: true });

	protected user: HetArchiefUser | Avo.User.User;
	protected id: string;
	protected firstName: string;
	protected lastName: string;
	protected mail: string;
	protected maintainerId: string;
	protected visitorSpaceSlug: string;
	protected permissions: Array<Permission>;

	public constructor(user: HetArchiefUser | Avo.User.User) {
		this.user = user;
		// can be archief-user or avo-user, where permissions are stored differently
		// merge them into 1 unified array
		this.permissions = [
			...((this.user as HetArchiefUser).permissions || []),
			...((this.user as Avo.User.User).profile.permissions || [])
		] as Permission[];
	}

	public getUser(): HetArchiefUser | Avo.User.User {
		return this.user;
	}

	public getId(): string {
		return (this.user as HetArchiefUser).id || (this.user as Avo.User.User).uid;
	}

	public getFirstName(): string {
		return (this.user as HetArchiefUser).firstName || (this.user as Avo.User.User).first_name;
	}

	public getLastName(): string {
		return (this.user as HetArchiefUser).lastName || (this.user as Avo.User.User).last_name;
	}

	public getFullName(): string {
		return (this.user as HetArchiefUser).fullName || (this.user as Avo.User.User).full_name;
	}

	public getMail(): string {
		return (this.user as HetArchiefUser).email || (this.user as Avo.User.User).mail;
	}

	public getGroupId(): string | number {
		return (this.user as HetArchiefUser).groupId || (this.user as Avo.User.User).profile?.userGroupIds?.[0] as number;
	}

	public getMaintainerId(): string {
		return get(this.user, "maintainerId");
	}

	public getVisitorSpaceSlug(): string {
		return get(this.user, "visitorSpaceSlug");
	}

	public has(permission: Permission): boolean {
		return this.permissions.includes(permission);
	}

	public hasNot(permission: Permission): boolean {
		return !this.has(permission);
	}

	public hasAny(permissions: Permission[]): boolean {
		if (permissions.length === 0) {
			return true;
		}

		return permissions.some((permission) => this.has(permission));
	}

	public hasAll(permissions: Permission[]): boolean {
		if (permissions.length === 0) {
			return true;
		}

		return permissions.every((permission) => this.has(permission));
	}
}
