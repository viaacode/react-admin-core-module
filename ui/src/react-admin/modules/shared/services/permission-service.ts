import type { Avo } from '@viaa/avo2-types';
import { PermissionName } from '@viaa/avo2-types';

export class PermissionService {
	public static hasPerm(
		user: Avo.User.CommonUser | undefined,
		permName: PermissionName
	): boolean {
		return PermissionService.getUserPermissions(user).includes(permName);
	}

	public static getUserPermissions(user: Avo.User.CommonUser | undefined): PermissionName[] {
		return user?.permissions || (user as any)?.profile?.permissions || [];
	}
}
