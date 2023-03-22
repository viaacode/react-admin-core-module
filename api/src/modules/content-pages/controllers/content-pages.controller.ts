import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	Headers,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Put,
	Query,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination';
import type { Avo } from '@viaa/avo2-types';
import { get } from 'lodash';
import { PermissionName } from '@viaa/avo2-types';

import { RequireAnyPermissions } from '../../shared/decorators/require-any-permissions.decorator';
import {
	ContentOverviewTableCols,
	ContentPageLabel,
	DbContentPage,
} from '../content-pages.types';

import { ContentPageOverviewParams } from '../dto/content-pages.dto';
import { ContentPageQueryTypes } from '../queries/content-pages.queries';
import { ContentPagesService } from '../services/content-pages.service';
import { SessionUserEntity } from '../../users/classes/session-user';
import { SessionUser } from '../../shared/decorators/user.decorator';
import { ApiKeyGuard } from '../../shared/guards/api-key.guard';
import { addPrefix } from '../../shared/helpers/add-route-prefix';

@ApiTags('ContentPages')
@Controller(addPrefix(process, 'content-pages'))
export class ContentPagesController {
	constructor(private contentPagesService: ContentPagesService) {}

	@Post('')
	@RequireAnyPermissions()
	public async getContentPagesForOverview(
		@Body() queryDto: ContentPageOverviewParams,
		@SessionUser() user?: SessionUserEntity,
	): Promise<
		IPagination<DbContentPage> & { labelCounts: Record<string, number> }
	> {
		return this.contentPagesService.getContentPagesForOverview(
			queryDto,
			user.getGroupIds(),
		);
	}

	@Get('overview')
	@RequireAnyPermissions(PermissionName.VIEW_ADMIN_DASHBOARD)
	public async fetchContentPages(
		@Query('offset', ParseIntPipe) offset: number,
		@Query('limit', ParseIntPipe) limit: number,
		@Query('sortColumn') sortColumn: ContentOverviewTableCols,
		@Query('sortOrder') sortOrder: Avo.Search.OrderDirection,
		@Query('tableColumnDataType') tableColumnDataType: string,
		@Query('where') where: string,
	): Promise<[DbContentPage[], number]> {
		return this.contentPagesService.fetchContentPages(
			offset || 0,
			limit || 20,
			sortColumn,
			sortOrder,
			tableColumnDataType,
			JSON.parse(where),
		);
	}

	@Get('')
	@ApiOperation({
		summary: 'Get content page by its path',
	})
	public async getContentPageByPath(
		@Query('path') path: string,
		@Req() request,
		@SessionUser() user?: SessionUserEntity,
	): Promise<DbContentPage> {
		return this.contentPagesService.getContentPageByPathForUser(
			path,
			user.getUser(),
			request?.headers?.['Referrer'],
		);
	}

	@Get('path-exists')
	async doesContentPageExist(
		@Query('path') path: string,
		@Req() request,
		@SessionUser() user,
	): Promise<{ exists: boolean; title: string; id: number }> {
		const contentPage = await this.getContentPageByPath(path, request, user);
		return {
			exists: !!contentPage,
			title: get(contentPage, 'title', null),
			id: get(contentPage, 'id', null),
		};
	}

	@Post('update-published-dates')
	@UseGuards(ApiKeyGuard)
	async updatePublishDates(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		@Headers('apikey') apikey: string,
	): Promise<{ message: string }> {
		const response = await this.contentPagesService.updatePublishDates();

		return {
			message: `content page publish dates have been updated, ${response.published} published, ${response.unpublished} unpublished`,
		};
	}

	@Get('public')
	@RequireAnyPermissions(
		PermissionName.EDIT_CONTENT_PAGE_LABELS,
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_OWN_CONTENT_PAGES,
	)
	public async getPublicContentItems(
		@Query('limit', ParseIntPipe) limit: number,
		@Query('title') title: string | undefined,
	): Promise<
		| ContentPageQueryTypes['GetContentPagesQueryAvo']['app_content']
		| ContentPageQueryTypes['GetContentPagesQueryHetArchief']['app_content_page']
		| ContentPageQueryTypes['GetPublicContentPagesByTitleQueryAvo']['app_content']
		| ContentPageQueryTypes['GetPublicContentPagesByTitleQueryHetArchief']['app_content_page']
		| null
	> {
		if (title) {
			return this.contentPagesService.getPublicContentItemsByTitle(
				title,
				limit,
			);
		} else {
			return this.contentPagesService.getPublicContentItems(limit);
		}
	}

	@Get('projects/public')
	@RequireAnyPermissions(
		PermissionName.EDIT_CONTENT_PAGE_LABELS,
		PermissionName.EDIT_OWN_CONTENT_PAGES,
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_NAVIGATION_BARS,
		PermissionName.EDIT_INTERACTIVE_TOURS,
	)
	public async getPublicProjectContentItems(
		@Query('limit', ParseIntPipe) limit: number,
		@Query('title') title: string | undefined,
	): Promise<
		| ContentPageQueryTypes['GetPublicProjectContentPagesQueryAvo']['app_content']
		| ContentPageQueryTypes['GetPublicProjectContentPagesQueryHetArchief']['app_content_page']
	> {
		if (title) {
			return this.contentPagesService.getPublicProjectContentItemsByTitle(
				title,
				limit,
			);
		} else {
			return this.contentPagesService.getPublicProjectContentItems(limit);
		}
	}

	@Get('labels')
	@RequireAnyPermissions(
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_OWN_CONTENT_PAGES,
	)
	public async fetchLabelsByContentType(
		@Query('contentType') contentType: string,
	): Promise<ContentPageLabel[]> {
		return this.contentPagesService.fetchLabelsByContentType(contentType);
	}

	@Put('labels')
	@RequireAnyPermissions(
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_OWN_CONTENT_PAGES,
	)
	public async insertContentLabelsLinks(
		@Body()
		body: {
			contentPageId: number | string; // Numeric ids in avo, uuid's in hetarchief. We would like to switch to uuids for avo as well at some point
			labelIds: (number | string)[];
		},
		@SessionUser() user: SessionUserEntity,
	): Promise<void> {
		if (!body.labelIds?.length) {
			return;
		}
		if (!user.has(PermissionName.EDIT_ANY_CONTENT_PAGES)) {
			const contentPage = await this.contentPagesService.getContentPageById(
				String(body.contentPageId),
			);
			if (contentPage.userProfileId !== user.getId()) {
				// User cannot add labels to other peoples pages
				throw new ForbiddenException(
					"You're not allowed to add labels to content pages that you do not own",
				);
			}
		}
		await this.contentPagesService.insertContentLabelsLinks(
			body.contentPageId,
			body.labelIds,
		);
	}

	@Delete('labels')
	@RequireAnyPermissions(
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_OWN_CONTENT_PAGES,
	)
	public async deleteContentLabelsLinks(
		@Body()
		body: {
			contentPageId: number | string; // Numeric ids in avo, uuid's in hetarchief. We would like to switch to uuids for avo as well at some point
			labelIds: (number | string)[];
		},
		@SessionUser() user: SessionUserEntity,
	): Promise<void> {
		if (!body.labelIds?.length) {
			return;
		}
		if (!user.has(PermissionName.EDIT_ANY_CONTENT_PAGES)) {
			const contentPage = await this.contentPagesService.getContentPageById(
				String(body.contentPageId),
			);
			if (contentPage.userProfileId !== user.getId()) {
				// User cannot add labels to other peoples pages
				throw new ForbiddenException(
					"You're not allowed to add labels to content pages that you do not own",
				);
			}
		}
		await this.contentPagesService.deleteContentLabelsLinks(
			body.contentPageId,
			body.labelIds,
		);
	}

	@Get('types')
	@RequireAnyPermissions(
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_OWN_CONTENT_PAGES,
	)
	public async getContentTypes(): Promise<
		{ value: Avo.ContentPage.Type; label: string }[] | null
	> {
		return this.contentPagesService.getContentTypes();
	}

	@Put()
	@RequireAnyPermissions(
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_OWN_CONTENT_PAGES,
	)
	public async insertContentPage(
		@Body()
		contentPage: DbContentPage,
		@SessionUser() user: SessionUserEntity,
	): Promise<DbContentPage | null> {
		if (
			!user.has(PermissionName.EDIT_ANY_CONTENT_PAGES) &&
			(!user.getProfileId() ||
				contentPage.userProfileId !== user.getProfileId())
		) {
			// User cannot edit other peoples pages
			throw new ForbiddenException(
				"You're not allowed to create content pages for other people",
			);
		}
		return this.contentPagesService.insertContentPage({
			...contentPage,
			// Default the owner of the content page to the current user if it is empty
			userProfileId: contentPage.userProfileId ?? user.getUser().profileId,
		});
	}

	@Patch()
	@RequireAnyPermissions(
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_OWN_CONTENT_PAGES,
	)
	public async updateContentPage(
		@Body()
		body: {
			contentPage: DbContentPage;
			initialContentPage: DbContentPage | undefined;
		},
		@SessionUser() user,
	): Promise<DbContentPage | null> {
		if (
			!user.has(PermissionName.EDIT_ANY_CONTENT_PAGES) &&
			body.contentPage.userProfileId !== user.id
		) {
			// User cannot edit other peoples pages
			throw new ForbiddenException(
				"You're not allowed to edit content pages that you do not own",
			);
		}
		return this.contentPagesService.updateContentPage(
			body.contentPage,
			body.initialContentPage,
		);
	}

	@Delete(':id')
	@RequireAnyPermissions(PermissionName.DELETE_ANY_CONTENT_PAGES)
	public async deleteContentPage(@Param('id') id: string): Promise<void> {
		await this.contentPagesService.deleteContentPage(id);
	}

	@Get('access')
	@RequireAnyPermissions(PermissionName.EDIT_NAVIGATION_BARS)
	public async getUserGroupsFromContentPage(
		@Query('path') path: string,
	): Promise<(string | number)[]> {
		return this.contentPagesService.getUserGroupsFromContentPage(path);
	}

	@Get(':id')
	@RequireAnyPermissions(
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_OWN_CONTENT_PAGES,
	)
	public async getContentPageById(
		@Param('id') id: string,
	): Promise<DbContentPage> {
		return this.contentPagesService.getContentPageById(id);
	}
}
