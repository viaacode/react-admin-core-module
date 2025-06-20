import type { Avo, PermissionName } from "@viaa/avo2-types";

export class PermissionService {
	public static hasPerm(
		user: Avo.User.CommonUser | undefined,
		permName: PermissionName,
	): boolean {
		return PermissionService.getUserPermissions(user).includes(permName);
	}

	public static getUserPermissions(
		user: Avo.User.CommonUser | undefined,
	): PermissionName[] {
		// biome-ignore lint/suspicious/noExplicitAny: todo
		return user?.permissions || (user as any)?.profile?.permissions || [];
	}
}
