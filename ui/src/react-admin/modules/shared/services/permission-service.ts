import type { AvoUserCommonUser, PermissionName } from '@viaa/avo2-types';

export class PermissionService {
	public static hasPerm(user: AvoUserCommonUser | undefined, permName: PermissionName): boolean {
		return PermissionService.getUserPermissions(user).includes(permName);
	}

	public static getUserPermissions(user: AvoUserCommonUser | undefined): PermissionName[] {
		// biome-ignore lint/suspicious/noExplicitAny: todo
		return user?.permissions || (user as any)?.profile?.permissions || [];
	}
}
