import {
	Body,
	Controller,
	Delete,
	forwardRef,
	Get,
	Inject,
	Patch,
	Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Avo } from '@viaa/avo2-types';
import { RequireAnyPermissions } from '../shared/decorators/require-any-permissions.decorator';
import { UsersService } from './users.service';
import {
	CommonUser,
	DeleteContentCounts,
	Permission,
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
		Permission.VIEW_USERS,
		Permission.EDIT_ANY_USER,
		Permission.EDIT_ANY_COLLECTIONS,
		Permission.VIEW_USERS_IN_SAME_COMPANY,
	)
	async getProfiles(
		@Query('offset') offset: number,
		@Query('limit') limit: number,
		@Query('sortColumn') sortColumn: UserOverviewTableCol,
		@Query('sortOrder') sortOrder: Avo.Search.OrderDirection,
		@Query('tableColumnDataType') tableColumnDataType: string,
		@Query('where') where = '{}',
	): Promise<[CommonUser[], number]> {
		return this.usersService.getProfiles(
			offset,
			limit,
			sortColumn,
			sortOrder,
			tableColumnDataType,
			JSON.parse(where),
		);
	}

	@Get('names')
	@RequireAnyPermissions(
		Permission.EDIT_ANY_USER,
		Permission.VIEW_COLLECTIONS_OVERVIEW,
		Permission.VIEW_BUNDLES_OVERVIEW,
		Permission.EDIT_OWN_CONTENT_PAGES,
		Permission.EDIT_ANY_CONTENT_PAGES,
		Permission.VIEW_USERS_IN_SAME_COMPANY,
	)
	async getNamesByProfileIds(
		@Query('profileIds') profileIds: string[],
	): Promise<Partial<CommonUser>[]> {
		return this.usersService.getNamesByProfileIds(profileIds);
	}

	@Get('ids')
	@RequireAnyPermissions(Permission.EDIT_ANY_USER)
	async getProfileIds(@Query('where') where = '{}'): Promise<string[]> {
		return this.usersService.getProfileIds(JSON.parse(where));
	}

	@Get('business-categories')
	@RequireAnyPermissions(Permission.VIEW_USERS)
	async fetchDistinctBusinessCategories(): Promise<string[]> {
		return this.usersService.fetchDistinctBusinessCategories();
	}

	@Get('idps')
	@RequireAnyPermissions(Permission.VIEW_USERS)
	async fetchIdps() {
		return this.usersService.fetchIdps();
	}

	@Get('counts')
	@RequireAnyPermissions(Permission.EDIT_ANY_USER)
	async fetchPublicAndPrivateCounts(
		@Query('profileIds') profileIds: string[],
	): Promise<DeleteContentCounts> {
		return this.usersService.fetchPublicAndPrivateCounts(profileIds);
	}

	@Patch('subjects')
	@RequireAnyPermissions(Permission.EDIT_ANY_USER)
	async bulkAddSubjectsToProfiles(
		@Body() body: { subjects: string[]; profileIds: string[] },
	): Promise<void> {
		return this.usersService.bulkAddSubjectsToProfiles(
			body.subjects,
			body.profileIds,
		);
	}

	@Delete('subjects')
	@RequireAnyPermissions(Permission.EDIT_ANY_USER)
	async bulkRemoveSubjectsFromProfiles(
		@Body() body: { subjects: string[]; profileIds: string[] },
	): Promise<void> {
		return this.usersService.bulkRemoveSubjectsFromProfiles(
			body.subjects,
			body.profileIds,
		);
	}
}
