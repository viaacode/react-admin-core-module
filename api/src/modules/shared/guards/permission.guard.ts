import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionName } from '@viaa/avo2-types';
import { Observable } from 'rxjs';

import { SessionUserEntity } from '../../users/classes/session-user';
import { SessionHelper } from '../auth/session-helper';
import { isAvo } from '../helpers/is-avo';

/**
 * Permissions used in the decorators that have a different name in the avo database
 */
const AVO_PERMISSION_ALIASES: Partial<Record<PermissionName, PermissionName>> = {
	[PermissionName.EDIT_PERMISSION_GROUPS]: PermissionName.EDIT_USER_GROUPS,
};

function toDatabasePermissions(permissions: PermissionName[]): PermissionName[] {
	if (!isAvo()) {
		return permissions;
	}
	return permissions.map((permission) => AVO_PERMISSION_ALIASES[permission] || permission);
}

@Injectable()
export class PermissionGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		// required permissions
		const requiredPermissionsClass =
			this.reflector.get<PermissionName[]>('requiredPermissions', context.getClass()) || [];
		const requiredPermissions =
			this.reflector.get<PermissionName[]>('requiredPermissions', context.getHandler()) || [];

		// any permissions
		const anyPermissionsClass =
			this.reflector.get<PermissionName[]>('requireAnyPermissions', context.getClass()) || [];
		const anyPermissions =
			this.reflector.get<PermissionName[]>('requireAnyPermissions', context.getHandler()) || [];

		const allRequiredPermissions = toDatabasePermissions([
			...requiredPermissionsClass,
			...requiredPermissions,
		]);
		const allAnyPermissions = toDatabasePermissions([...anyPermissionsClass, ...anyPermissions]);
		const allPermissions = [
			...requiredPermissionsClass,
			...requiredPermissions,
			...anyPermissionsClass,
			...anyPermissions,
		];

		if (allPermissions.length === 0) {
			// no permissions specified -- passed
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const userInfo = SessionHelper.getUserInfo(request);
		if (!userInfo) {
			throw new UnauthorizedException('You must be logged in to use this endpoint');
		}
		const user = new SessionUserEntity(userInfo);
		// User needs all required permissions
		if (!user.hasAll(allRequiredPermissions)) {
			throw new ForbiddenException("You don't have the required permission for this route");
		}
		// user needs any of the anyPermissions
		if (!user.hasAny(allAnyPermissions)) {
			throw new ForbiddenException("You don't have the required permission for this route");
		}
		return true;
	}
}
