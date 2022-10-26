import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PermissionsService } from '../services/permissions.service';
import { PermissionResponse } from '../types';

import { Permission } from '../../users/types';
import { RequireAllPermissions } from '../../shared/decorators/require-permissions.decorator';
import { LoggedInGuard } from '../../shared/guards/logged-in.guard';

@UseGuards(LoggedInGuard)
@ApiTags('Permissions')
@Controller(process.env.ADMIN_CORE_ROUTES_PREFIX + '/permissions')
@RequireAllPermissions(Permission.EDIT_PERMISSION_GROUPS)
export class PermissionsController {
	constructor(private permissionsService: PermissionsService) {}

	@Get()
	public async getPermissions(): Promise<PermissionResponse[]> {
		return this.permissionsService.getPermissions();
	}
}
