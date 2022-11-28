import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	Headers,
	MethodNotAllowedException,
	Param,
	Patch,
	Post,
	Put,
	Query,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination';
import { Avo } from '@viaa/avo2-types';
import { compact, get, intersection } from 'lodash';
import { RequireAnyPermissions } from '../../shared/decorators/require-any-permissions.decorator';
import { Permission } from '../../users/users.types';
import { ContentBlockConfig } from '../content-block.types';

import { ContentOverviewTableCols, ContentPage } from '../content-pages.types';

import { ContentPageOverviewParams } from '../dto/content-pages.dto';
import { ResolveMediaGridBlocksDto } from '../dto/resolve-media-grid-blocks.dto';
import { ContentPageQueryTypes } from '../queries/content-pages.queries';
import { ContentPagesService } from '../services/content-pages.service';
import { SessionUserEntity } from '../../users/classes/session-user';
import { SessionHelper } from '../../shared/auth/session-helper';
import { SessionUser } from '../../shared/decorators/user.decorator';
import { ApiKeyGuard } from '../../shared/guards/api-key.guard';
import { LoggedInGuard } from '../../shared/guards/logged-in.guard';
import { SpecialPermissionGroups } from '../../shared/types/types';

@ApiTags('ContentPages')
@Controller(process.env.ADMIN_CORE_ROUTES_PREFIX + '/content-pages')
export class ContentPagesController {
	constructor(private contentPagesService: ContentPagesService) {}

	@Post('overview')
	@RequireAnyPermissions(
		Permission.EDIT_ANY_CONTENT_PAGES,
		Permission.EDIT_OWN_CONTENT_PAGES,
	)
	public async getContentPagesForOverview(
		@Body() queryDto: ContentPageOverviewParams,
		@SessionUser() user?: SessionUserEntity,
	): Promise<IPagination<ContentPage>> {
		return this.contentPagesService.getContentPagesForOverview(
			queryDto,
			compact([
				String(user?.getGroupId()),
				user?.getUser()
					? SpecialPermissionGroups.loggedInUsers
					: SpecialPermissionGroups.loggedOutUsers,
			]),
		);
	}

	@Get('')
	@ApiOperation({
		summary: 'Get content page by its path',
	})
	public async getContentPageByPath(
		@Query('path') path: string,
		@Req() request,
		@SessionUser() user: SessionUserEntity,
	): Promise<ContentPage> {
		const contentPage: ContentPage | undefined =
			await this.contentPagesService.getContentPageByPath(path);

		const permissions = get(user.getUser(), 'permissions', []);
		const userId = user.getId();
		const canEditContentPage =
			permissions.includes(Permission.EDIT_ANY_CONTENT_PAGES) ||
			(permissions.includes(Permission.EDIT_OWN_CONTENT_PAGES) &&
				contentPage.owner.id === userId);

		if (!contentPage) {
			return null;
		}

		// People that can edit the content page are not restricted by the publish_at, depublish_at, is_public settings
		if (!canEditContentPage) {
			if (
				contentPage.publishAt &&
				new Date().getTime() < new Date(contentPage.publishAt).getTime()
			) {
				return null; // Not yet published
			}

			if (
				contentPage.depublishAt &&
				new Date().getTime() > new Date(contentPage.depublishAt).getTime()
			) {
				throw new BadRequestException({
					message: 'The content page was depublished',
					additionalInfo: {
						code: 'CONTENT_PAGE_DEPUBLISHED',
						contentPageType: get(contentPage, 'content_type'),
					},
				});
			}

			if (!contentPage.isPublic) {
				return null;
			}

			// Check if content page is accessible for the user who requested the content page
			if (
				!intersection(
					contentPage.userGroupIds.map((id) => String(id)),
					SessionHelper.getUserGroupIds(String(user.getGroupId())),
				).length
			) {
				return null;
			}
		}

		// Check if content page contains any search query content bocks (eg: media grids)
		await this.contentPagesService.resolveMediaTileItemsInPage(
			contentPage,
			request,
		);

		// Check if content page contains any media player content blocks (eg: mediaplayer, mediaPlayerTitleTextButton, hero)
		if (request) {
			await this.contentPagesService.resolveMediaPlayersInPage(
				contentPage,
				request,
			);
		}

		return contentPage;
	}

	@Get('path-exist')
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

	@Post('')
	@ApiOperation({
		summary:
			'Resolves the objects (items, collections, bundles, search queries) that are references inside the media grid blocks to their actual objects',
	})
	@ApiResponse({
		status: 200,
		description:
			'the media grid blocks with their content stored under the results property',
		type: Array,
	})
	@UseGuards(LoggedInGuard)
	async resolveMediaGridBlocks(
		body: ResolveMediaGridBlocksDto,
		@SessionUser() user: SessionUserEntity,
		@Req() request,
	): Promise<any[]> {
		if (user.has(Permission.SEARCH)) {
			throw new ForbiddenException(
				'You do not have the required permission for this route',
			);
		}
		return await this.contentPagesService.resolveMediaTileItems(
			body.searchQuery,
			body.searchQueryLimit,
			body.mediaItems,
			request,
		);
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
		Permission.EDIT_CONTENT_PAGE_LABELS,
		Permission.EDIT_ANY_CONTENT_PAGES,
		Permission.EDIT_OWN_CONTENT_PAGES,
	)
	public async getPublicContentItems(
		@Query('limit') limit: number,
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
		Permission.EDIT_CONTENT_PAGE_LABELS,
		Permission.EDIT_OWN_CONTENT_PAGES,
		Permission.EDIT_ANY_CONTENT_PAGES,
		Permission.EDIT_NAVIGATION_BARS,
	)
	public async getPublicProjectContentItems(
		@Query('limit') limit: number,
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
	public async fetchLabelsByContentType(
		@Query('contentType') contentType: string,
	): Promise<Avo.ContentPage.Label[]> {
		return this.contentPagesService.fetchLabelsByContentType(contentType);
	}

	@Put('labels')
	@RequireAnyPermissions(Permission.EDIT_CONTENT_PAGE_LABELS)
	public async insertContentLabelsLinks(
		@Body()
		insertContentLabelLink: {
			contentPageId: number | string; // Numeric ids in avo, uuid's in hetarchief. We would like to switch to uuids for avo as well at some point
			labelIds: (number | string)[];
		},
	): Promise<void> {
		await this.contentPagesService.insertContentLabelsLinks(
			insertContentLabelLink.contentPageId,
			insertContentLabelLink.labelIds,
		);
	}

	@Delete('labels')
	@RequireAnyPermissions(Permission.EDIT_CONTENT_PAGE_LABELS)
	public async deleteContentLabelsLinks(
		@Body()
		deleteContentLabelLink: {
			contentPageId: number | string; // Numeric ids in avo, uuid's in hetarchief. We would like to switch to uuids for avo as well at some point
			labelIds: (number | string)[];
		},
	): Promise<void> {
		await this.contentPagesService.deleteContentLabelsLinks(
			deleteContentLabelLink.contentPageId,
			deleteContentLabelLink.labelIds,
		);
	}

	@Get(':id')
	@RequireAnyPermissions(
		Permission.EDIT_ANY_CONTENT_PAGES,
		Permission.EDIT_OWN_CONTENT_PAGES,
	)
	public async getContentPageById(
		@Param('id') id: number | string,
	): Promise<
		| ContentPageQueryTypes['GetContentByIdQueryAvo']['app_content'][0]
		| ContentPageQueryTypes['GetContentByIdQueryHetArchief']['app_content_page'][0]
	> {
		return this.contentPagesService.getContentPageById(id);
	}

	@Get('types')
	@RequireAnyPermissions(
		Permission.EDIT_ANY_CONTENT_PAGES,
		Permission.EDIT_OWN_CONTENT_PAGES,
	)
	public async getContentTypes(): Promise<
		{ value: Avo.ContentPage.Type; label: string }[] | null
	> {
		return this.contentPagesService.getContentTypes();
	}

	@Get()
	public async fetchContentPages(
		@Query('offset') offset: number,
		@Query('limit') limit: number,
		@Query('sortColumn') sortColumn: ContentOverviewTableCols,
		@Query('sortOrder') sortOrder: Avo.Search.OrderDirection,
		@Query('tableColumnDataType') tableColumnDataType: string,
		@Query('where') where: string,
	): Promise<
		[
			(
				| ContentPageQueryTypes['GetContentPagesQueryAvo']['app_content']
				| ContentPageQueryTypes['GetContentPagesQueryHetArchief']['app_content_page']
			),
			number,
		]
	> {
		return this.contentPagesService.fetchContentPages(
			offset,
			limit,
			sortColumn,
			sortOrder,
			tableColumnDataType,
			JSON.parse(where),
		);
	}

	@Put()
	@RequireAnyPermissions(
		Permission.EDIT_ANY_CONTENT_PAGES,
		Permission.EDIT_OWN_CONTENT_PAGES,
	)
	public async insertContentPage(
		@Body()
		contentPage: ContentPageQueryTypes['InsertContentMutationVariables']['contentPage'] & {
			contentBlockConfigs: ContentBlockConfig[];
		},
		@SessionUser() user,
	): Promise<
		| (ContentPageQueryTypes['InsertContentMutationVariables']['contentPage'] & {
				contentBlockConfigs: ContentBlockConfig[];
		  })
		| null
	> {
		if (
			!user.has(Permission.EDIT_ANY_CONTENT_PAGES) &&
			contentPage.user_profile_id !== user.id
		) {
			// User cannot edit other peoples pages
			throw new ForbiddenException(
				"You're not allowed to create content pages for other people",
			);
		}
		return this.contentPagesService.insertContentPage(contentPage);
	}

	@Patch()
	@RequireAnyPermissions(
		Permission.EDIT_ANY_CONTENT_PAGES,
		Permission.EDIT_OWN_CONTENT_PAGES,
	)
	public async updateContentPage(
		@Body()
		body: {
			contentPage: ContentPageQueryTypes['UpdateContentByIdMutationVariables']['contentPage'] & {
				contentBlockConfigs: ContentBlockConfig[];
			};
			initialContentPage:
				| { contentBlockConfigs: ContentBlockConfig[] }
				| undefined;
		},
		@SessionUser() user,
	): Promise<
		| ContentPageQueryTypes['UpdateContentByIdMutationVariables']['contentPage']
		| null
	> {
		if (
			!user.has(Permission.EDIT_ANY_CONTENT_PAGES) &&
			body.contentPage.user_profile_id !== user.id
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
	@RequireAnyPermissions(Permission.DELETE_ANY_CONTENT_PAGES)
	public async deleteContentPage(
		@Param('id') id: number | string,
	): Promise<void> {
		await this.contentPagesService.deleteContentPage(id);
	}

	@Get('access')
	@RequireAnyPermissions(Permission.EDIT_NAVIGATION_BARS)
	public async getUserGroupsFromContentPage(
		@Query('path') path: string,
	): Promise<(string | number)[]> {
		return this.contentPagesService.getUserGroupsFromContentPage(path);
	}
}
