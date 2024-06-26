import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PermissionName } from '@viaa/avo2-types';

import { RequireAllPermissions } from '../../shared/decorators/require-permissions.decorator';
import { LoggedInGuard } from '../../shared/guards/logged-in.guard';
import { addPrefix } from '../../shared/helpers/add-route-prefix';
import { UpdateUserGroupsDto } from '../dto/user-groups.dto';
import { UserGroupsService } from '../services/user-groups.service';
import { UserGroupWithPermissions } from '../user-groups.types';

@UseGuards(LoggedInGuard)
@ApiTags('UserGroups')
@Controller(addPrefix(process, 'user-groups'))
@RequireAllPermissions(PermissionName.EDIT_PERMISSION_GROUPS)
export class UserGroupsController {
	constructor(private userGroupsService: UserGroupsService) {}

	@Get()
	public async getUserGroups(
		@Query('withPermissions') withPermissions?: 'true' | 'false'
	): Promise<UserGroupWithPermissions[]> {
		return this.userGroupsService.getUserGroups(withPermissions === 'true');
	}

	@Patch()
	public async updateUserGroups(
		@Body() updateUserGroupsDto: UpdateUserGroupsDto
	): Promise<{ deleted: number; inserted: number }> {
		return this.userGroupsService.updateUserGroups(updateUserGroupsDto.updates);
	}
}
