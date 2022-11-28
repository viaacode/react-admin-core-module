import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequireAllPermissions } from '../../shared/decorators/require-permissions.decorator';
import { LoggedInGuard } from '../../shared/guards/logged-in.guard';
import { Permission } from '../../users/users.types';

import { UpdateUserGroupsDto } from '../dto/user-groups.dto';
import { UserGroupsService } from '../services/user-groups.service';
import { UserGroupWithPermissions } from '../user-groups.types';

@UseGuards(LoggedInGuard)
@ApiTags('UserGroups')
@Controller(process.env.ADMIN_CORE_ROUTES_PREFIX + '/user-groups')
@RequireAllPermissions(Permission.EDIT_PERMISSION_GROUPS)
export class UserGroupsController {
	constructor(private userGroupsService: UserGroupsService) {}

	@Get()
	public async getUserGroups(): Promise<UserGroupWithPermissions[]> {
		return this.userGroupsService.getUserGroups();
	}

	@Patch()
	public async updateUserGroups(
		@Body() updateUserGroupsDto: UpdateUserGroupsDto,
	): Promise<{ deleted: number; inserted: number }> {
		return this.userGroupsService.updateUserGroups(updateUserGroupsDto.updates);
	}
}
