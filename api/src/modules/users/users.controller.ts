import {
	Body,
	Controller,
	Delete,
	forwardRef,
	Get,
	Inject,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { Avo } from '@viaa/avo2-types'
import { PermissionName } from '@viaa/avo2-types'

import { RequireAnyPermissions } from '../shared/decorators/require-any-permissions.decorator'

import { UsersService } from './users.service'
import type { DeleteContentCounts, QueryProfilesBody, UserOverviewTableCol } from './users.types'

@ApiTags('Users')
@Controller(process.env.ADMIN_CORE_ROUTES_PREFIX + '/users')
export class UsersController {
	constructor(
		@Inject(forwardRef(() => UsersService))
		protected usersService: UsersService
	) {}

	/**
	 * @deprecated use POST /users instead to avoid issues with query params getting too big for the url
	 * @param offset
	 * @param limit
	 * @param sortColumn
	 * @param sortOrder
	 * @param tableColumnDataType
	 * @param where
	 */
	@Get('')
	@RequireAnyPermissions(
		PermissionName.VIEW_USERS,
		PermissionName.EDIT_ANY_USER,
		PermissionName.EDIT_ANY_COLLECTIONS,
		PermissionName.VIEW_USERS_IN_SAME_COMPANY
	)
	async getProfiles(
		@Query('offset') offset: string,
		@Query('limit') limit: string,
		@Query('sortColumn') sortColumn: UserOverviewTableCol,
		@Query('sortOrder') sortOrder: Avo.Search.OrderDirection,
		@Query('tableColumnDataType') tableColumnDataType: string,
		@Query('where') where = '{}'
	): Promise<[Avo.User.CommonUser[], number]> {
		return this.usersService.getProfiles(
			parseInt(offset || '0'),
			parseInt(limit || '50'),
			sortColumn,
			sortOrder,
			tableColumnDataType,
			JSON.parse(where)
		)
	}

	@Post('')
	@RequireAnyPermissions(
		PermissionName.VIEW_USERS,
		PermissionName.EDIT_ANY_USER,
		PermissionName.EDIT_ANY_COLLECTIONS,
		PermissionName.VIEW_USERS_IN_SAME_COMPANY
	)
	async getProfilesPost(
		@Body() body: QueryProfilesBody
	): Promise<[Avo.User.CommonUser[], number]> {
		return this.usersService.getProfiles(
			parseInt(body.offset || '0'),
			parseInt(body.limit || '50'),
			body.sortColumn,
			body.sortOrder,
			body.tableColumnDataType,
			JSON.parse(body.where)
		)
	}

	@Get('names')
	@RequireAnyPermissions(
		PermissionName.EDIT_ANY_USER,
		PermissionName.VIEW_COLLECTIONS_OVERVIEW,
		PermissionName.VIEW_BUNDLES_OVERVIEW,
		PermissionName.EDIT_OWN_CONTENT_PAGES,
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.VIEW_USERS_IN_SAME_COMPANY
	)
	async getNamesByProfileIds(
		@Query('profileIds') profileIds: string[]
	): Promise<Partial<Avo.User.CommonUser>[]> {
		return this.usersService.getNamesByProfileIds(profileIds)
	}

	@Get('ids')
	@RequireAnyPermissions(PermissionName.EDIT_ANY_USER)
	async getProfileIds(@Query('where') where = '{}'): Promise<string[]> {
		return this.usersService.getProfileIds(JSON.parse(where))
	}

	@Get('business-categories')
	@RequireAnyPermissions(PermissionName.VIEW_USERS)
	async fetchDistinctBusinessCategories(): Promise<string[]> {
		return this.usersService.fetchDistinctBusinessCategories()
	}

	@Get('idps')
	@RequireAnyPermissions(PermissionName.VIEW_USERS)
	async fetchIdps() {
		return this.usersService.fetchIdps()
	}

	@Get('counts')
	@RequireAnyPermissions(PermissionName.EDIT_ANY_USER)
	async fetchPublicAndPrivateCounts(
		@Query('profileIds') profileIds: string[]
	): Promise<DeleteContentCounts> {
		return this.usersService.fetchPublicAndPrivateCounts(profileIds)
	}

	@Patch('loms')
	@RequireAnyPermissions(PermissionName.EDIT_ANY_USER)
	async bulkAddLomsToProfiles(
		@Body() body: { lomIds: string[]; profileIds: string[] }
	): Promise<void> {
		return this.usersService.bulkAddLomsToProfiles(body.lomIds, body.profileIds)
	}

	@Delete('loms')
	@RequireAnyPermissions(PermissionName.EDIT_ANY_USER)
	async bulkRemoveLomsFromProfiles(
		@Body() body: { lomIds: string[]; profileIds: string[] }
	): Promise<void> {
		return this.usersService.bulkRemoveLomsFromProfiles(body.lomIds, body.profileIds)
	}

	@Get(':id')
	@RequireAnyPermissions(
		PermissionName.VIEW_USERS,
		PermissionName.EDIT_ANY_USER,
		PermissionName.EDIT_ANY_COLLECTIONS,
		PermissionName.VIEW_USERS_IN_SAME_COMPANY
	)
	async getUser(@Param('id') id: string): Promise<Avo.User.CommonUser> {
		return this.usersService.getById(id)
	}
}
