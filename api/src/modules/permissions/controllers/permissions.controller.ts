import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PermissionName } from '@viaa/avo2-types';

import { RequireAllPermissions } from '../../shared/decorators/require-permissions.decorator';
import { LoggedInGuard } from '../../shared/guards/logged-in.guard';
import { PermissionData } from '../permissions.types';
import { PermissionsService } from '../services/permissions.service';

@UseGuards(LoggedInGuard)
@ApiTags('Permissions')
@Controller(process.env.ADMIN_CORE_ROUTES_PREFIX + '/permissions')
@RequireAllPermissions(PermissionName.EDIT_PERMISSION_GROUPS)
export class PermissionsController {
	constructor(private permissionsService: PermissionsService) {}

	@Get()
	public async getPermissions(): Promise<PermissionData[]> {
		return this.permissionsService.getPermissions();
	}
}
