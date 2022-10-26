import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Configuration } from '../../../../config';

import { SessionUserEntity } from '../../users/classes/session-user';
import { Permission } from '../../users/types';
import { SessionHelper } from '../auth/session-helper';

@Injectable()
export class PermissionGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private configService: ConfigService<Configuration>,
	) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		if (this.configService.get('IS_ADMIN_CORE_DEMO_APP')) {
			return true; // There is no authentication in the admin core test app
		}

		// required permissions
		const requiredPermissionsClass =
			this.reflector.get<Permission[]>(
				'requiredPermissions',
				context.getClass(),
			) || [];
		const requiredPermissions =
			this.reflector.get<Permission[]>(
				'requiredPermissions',
				context.getHandler(),
			) || [];

		// any permissions
		const anyPermissionsClass =
			this.reflector.get<Permission[]>(
				'requireAnyPermissions',
				context.getClass(),
			) || [];
		const anyPermissions =
			this.reflector.get<Permission[]>(
				'requireAnyPermissions',
				context.getHandler(),
			) || [];

		const allRequiredPermissions = [
			...requiredPermissionsClass,
			...requiredPermissions,
		];
		const allAnyPermissions = [...anyPermissionsClass, ...anyPermissions];
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
		const user = new SessionUserEntity(
			SessionHelper.getArchiefUserInfo(request.session),
		);
		// User needs all required permissions
		if (!user.hasAll(allRequiredPermissions)) {
			throw new ForbiddenException(
				"You don't have the required permission for this route",
			);
		}
		// user needs any of the anyPermissions
		if (!user.hasAny(allAnyPermissions)) {
			throw new ForbiddenException(
				"You don't have the required permission for this route",
			);
		}
		return true;
	}
}