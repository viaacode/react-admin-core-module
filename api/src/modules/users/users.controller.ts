import {
	Body,
	Controller,
	Delete,
	forwardRef,
	Get,
	Inject,
	Param,
	Patch,
	Query,
} from '@nestjs/common';
import { PermissionName } from '@viaa/avo2-types';
import { ApiTags } from '@nestjs/swagger';
import type { Avo } from '@viaa/avo2-types';

import { RequireAnyPermissions } from '../shared/decorators/require-any-permissions.decorator';
import { UsersService } from './users.service';
import {
	CommonUser,
	DeleteContentCounts,
	UserOverviewTableCol,
} from './users.types';

@ApiTags('Users')
@Controller(process.env.ADMIN_CORE_ROUTES_PREFIX + '/users')
export class UsersController {
	constructor(
		@Inject(forwardRef(() => UsersService))
		protected usersService: UsersService,
	) {}

	@Get('')
	@RequireAnyPermissions(
		PermissionName.VIEW_USERS,
		PermissionName.EDIT_ANY_USER,
		PermissionName.EDIT_ANY_COLLECTIONS,
		PermissionName.VIEW_USERS_IN_SAME_COMPANY,
	)
	async getProfiles(
		@Query('offset') offset: string,
		@Query('limit') limit: string,
		@Query('sortColumn') sortColumn: UserOverviewTableCol,
		@Query('sortOrder') sortOrder: Avo.Search.OrderDirection,
		@Query('tableColumnDataType') tableColumnDataType: string,
		@Query('where') where = '{}',
	): Promise<[CommonUser[], number]> {
		return this.usersService.getProfiles(
			parseInt(offset || '0'),
			parseInt(limit || '50'),
			sortColumn,
			sortOrder,
			tableColumnDataType,
			JSON.parse(where),
		);
	}

	@Get('names')
	@RequireAnyPermissions(
		PermissionName.EDIT_ANY_USER,
		PermissionName.VIEW_COLLECTIONS_OVERVIEW,
		PermissionName.VIEW_BUNDLES_OVERVIEW,
		PermissionName.EDIT_OWN_CONTENT_PAGES,
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.VIEW_USERS_IN_SAME_COMPANY,
	)
	async getNamesByProfileIds(
		@Query('profileIds') profileIds: string[],
	): Promise<Partial<CommonUser>[]> {
		return this.usersService.getNamesByProfileIds(profileIds);
	}

	@Get('ids')
	@RequireAnyPermissions(PermissionName.EDIT_ANY_USER)
	async getProfileIds(@Query('where') where = '{}'): Promise<string[]> {
		return this.usersService.getProfileIds(JSON.parse(where));
	}

	@Get('business-categories')
	@RequireAnyPermissions(PermissionName.VIEW_USERS)
	async fetchDistinctBusinessCategories(): Promise<string[]> {
		return this.usersService.fetchDistinctBusinessCategories();
	}

	@Get('idps')
	@RequireAnyPermissions(PermissionName.VIEW_USERS)
	async fetchIdps() {
		return this.usersService.fetchIdps();
	}

	@Get('counts')
	@RequireAnyPermissions(PermissionName.EDIT_ANY_USER)
	async fetchPublicAndPrivateCounts(
		@Query('profileIds') profileIds: string[],
	): Promise<DeleteContentCounts> {
		return this.usersService.fetchPublicAndPrivateCounts(profileIds);
	}

	@Patch('subjects')
	@RequireAnyPermissions(PermissionName.EDIT_ANY_USER)
	async bulkAddSubjectsToProfiles(
		@Body() body: { subjects: string[]; profileIds: string[] },
	): Promise<void> {
		return this.usersService.bulkAddSubjectsToProfiles(
			body.subjects,
			body.profileIds,
		);
	}

	@Delete('subjects')
	@RequireAnyPermissions(PermissionName.EDIT_ANY_USER)
	async bulkRemoveSubjectsFromProfiles(
		@Body() body: { subjects: string[]; profileIds: string[] },
	): Promise<void> {
		return this.usersService.bulkRemoveSubjectsFromProfiles(
			body.subjects,
			body.profileIds,
		);
	}

	@Get(':id')
	@RequireAnyPermissions(
		PermissionName.VIEW_USERS,
		PermissionName.EDIT_ANY_USER,
		PermissionName.EDIT_ANY_COLLECTIONS,
		PermissionName.VIEW_USERS_IN_SAME_COMPANY,
	)
	async getUser(@Param('id') id: string): Promise<CommonUser> {
		return this.usersService.getById(id);
	}
}
