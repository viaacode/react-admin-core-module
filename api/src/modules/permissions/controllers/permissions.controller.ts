import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PermissionInfo } from '../permissions.types';

import { PermissionsService } from '../services/permissions.service';

import { Permission } from '../../users/types';
import { RequireAllPermissions } from '../../shared/decorators/require-permissions.decorator';
import { LoggedInGuard } from '../../shared/guards/logged-in.guard';
import { addPrefix } from '../../shared/helpers/add-route-prefix';

@UseGuards(LoggedInGuard)
@ApiTags('Permissions')
@Controller(addPrefix(process, 'permissions'))
@RequireAllPermissions(Permission.EDIT_PERMISSION_GROUPS)
export class PermissionsController {
	constructor(private permissionsService: PermissionsService) {}

	@Get()
	public async getPermissions(): Promise<PermissionInfo[]> {
		return this.permissionsService.getPermissions();
	}
}
