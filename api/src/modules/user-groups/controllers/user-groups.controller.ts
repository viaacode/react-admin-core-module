import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PermissionName } from '@viaa/avo2-types';

import { RequireAnyPermissions } from '../../shared/decorators/require-any-permissions.decorator';
import { RequireAllPermissions } from '../../shared/decorators/require-permissions.decorator';
import { LoggedInGuard } from '../../shared/guards/logged-in.guard';
import { addPrefix } from '../../shared/helpers/add-route-prefix';
import { UpdateUserGroupsDto } from '../dto/user-groups.dto';
import { UserGroupsService } from '../services/user-groups.service';
import { UserGroupWithPermissions } from '../user-groups.types';

@UseGuards(LoggedInGuard)
@ApiTags('UserGroups')
@Controller(addPrefix(process, 'user-groups'))
export class UserGroupsController {
	constructor(private userGroupsService: UserGroupsService) {}

	/**
	 * The user groups are also used outside the permissions screen
	 * eg: the user group select of the content page and navigation editors, the content page preview bar and the user overview filters
	 */
	@Get()
	@RequireAnyPermissions(
		PermissionName.EDIT_PERMISSION_GROUPS,
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_OWN_CONTENT_PAGES,
		PermissionName.EDIT_NAVIGATION_BARS,
		PermissionName.VIEW_USERS,
		PermissionName.VIEW_ANY_MAINTENANCE_ALERTS
	)
	public async getUserGroups(
		@Query('withPermissions') withPermissions?: 'true' | 'false'
	): Promise<UserGroupWithPermissions[]> {
		return this.userGroupsService.getUserGroups(withPermissions === 'true');
	}

	@Patch()
	@RequireAllPermissions(PermissionName.EDIT_PERMISSION_GROUPS)
	public async updateUserGroups(
		@Body() updateUserGroupsDto: UpdateUserGroupsDto
	): Promise<{ deleted: number; inserted: number }> {
		return this.userGroupsService.updateUserGroups(updateUserGroupsDto.updates);
	}
}
