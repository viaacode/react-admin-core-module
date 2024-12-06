import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	Headers,
	InternalServerErrorException,
	Ip,
	NotFoundException,
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
import { AssetType, PermissionName } from '@viaa/avo2-types';
import { Request } from 'express';

import { AssetsService } from '../../assets';
import { RequireAnyPermissions } from '../../shared/decorators/require-any-permissions.decorator';
import { SessionUser } from '../../shared/decorators/user.decorator';
import { ApiKeyGuard } from '../../shared/guards/api-key.guard';
import { addPrefix } from '../../shared/helpers/add-route-prefix';
import { CustomError } from '../../shared/helpers/error';
import { logAndThrow } from '../../shared/helpers/logAndThrow';
import { Locale } from '../../translations';
import { SessionUserEntity } from '../../users/classes/session-user';
import { CONTENT_PAGE_COPY, CONTENT_PAGE_COPY_REGEX } from '../content-pages.consts';
import { ContentOverviewTableCols, ContentPageLabel, DbContentPage } from '../content-pages.types';
import { ContentPageOverviewParams } from '../dto/content-pages.dto';
import { ContentPageQueryTypes } from '../queries/content-pages.queries';
import { ContentPagesService } from '../services/content-pages.service';

@ApiTags('ContentPages')
@Controller(addPrefix(process, 'content-pages'))
export class ContentPagesController {
	constructor(
		private contentPagesService: ContentPagesService,
		private assetsService: AssetsService
	) {}

	/**
	 * Fetches content pages to be shown in the PageOverviewBlock content block
	 * @param queryDto
	 * @param user
	 */
	@Post('page-overview-block')
	public async getContentPagesForPageOverviewBlock(
		@Body() queryDto: ContentPageOverviewParams,
		@SessionUser() user?: SessionUserEntity
	): Promise<IPagination<DbContentPage> & { labelCounts: Record<string, number> }> {
		return this.contentPagesService.getContentPagesForPageOverviewBlock(
			queryDto,
			user.getGroupIds()
		);
	}

	/**
	 * Used to fetch content pages for the content page overview table in the admin dashboard
	 * @param offset
	 * @param limit
	 * @param sortColumn
	 * @param sortOrder
	 * @param tableColumnDataType
	 * @param where
	 */
	@Get('')
	@RequireAnyPermissions(PermissionName.VIEW_ADMIN_DASHBOARD)
	public async fetchContentPages(
		@Query('offset', ParseIntPipe) offset: number,
		@Query('limit', ParseIntPipe) limit: number,
		@Query('sortColumn') sortColumn: ContentOverviewTableCols,
		@Query('sortOrder') sortOrder: Avo.Search.OrderDirection,
		@Query('tableColumnDataType') tableColumnDataType: string,
		@Query('where') where: string
	): Promise<[DbContentPage[], number]> {
		return this.contentPagesService.fetchContentPages(
			offset || 0,
			limit || 20,
			sortColumn,
			sortOrder,
			tableColumnDataType,
			JSON.parse(where)
		);
	}

	@Get('by-language-and-path')
	@ApiOperation({
		summary: 'Get content page by its path',
	})
	public async getContentPageByLanguageAndPath(
		@Query('language') language: Locale | undefined,
		@Query('path') path: string,
		@Query('onlyInfo') onlyInfo: string,
		@Req() request: Request,
		@Ip() ip,
		@SessionUser() sessionUser: SessionUserEntity
	): Promise<DbContentPage> {
		const user = sessionUser?.getUser();
		return this.contentPagesService.getContentPageByLanguageAndPathForUser(
			language || (user.language as Locale),
			path,
			user,
			request?.headers?.['Referrer'] as string,
			ip,
			onlyInfo === 'true'
		);
	}

	@Get('path-exists')
	async doesContentPageExist(
		@Query('language') language: Locale,
		@Query('path') path: string,
		@Req() request: Request,
		@Ip() ip,
		@SessionUser() user: SessionUserEntity
	): Promise<{ exists: boolean; title: string; id: number | string }> {
		const contentPage = await this.getContentPageByLanguageAndPath(
			language,
			path,
			'true',
			request,
			ip,
			user
		);
		return {
			exists: !!contentPage,
			title: contentPage?.title ?? null,
			id: contentPage?.id ?? null,
		};
	}

	@Post('update-published-dates')
	@UseGuards(ApiKeyGuard)
	async updatePublishDates(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		@Headers('apikey') apikey: string
	): Promise<{ message: string }> {
		const response = await this.contentPagesService.updatePublishDates();

		const message = `content page publish dates have been updated, ${
			response.publishedCount
		} pages published (${response.publishedIds.join(',') || 'none'}), ${
			response.unpublishedCount
		} pages unpublished (${response.unpublishedIds.join(',') || 'none'})`;
		console.log('[WEBHOOK] ' + message);
		return {
			message,
		};
	}

	@Get('nl-parent-pages')
	@RequireAnyPermissions(
		PermissionName.EDIT_CONTENT_PAGE_LABELS,
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_OWN_CONTENT_PAGES
	)
	public async getNlParentContentPages(
		@Query('limit', ParseIntPipe) limit: number,
		@Query('title') title: string | undefined
	): Promise<
		| ContentPageQueryTypes['GetNlParentContentPagesQueryAvo']['app_content']
		| ContentPageQueryTypes['GetNlParentContentPagesQueryHetArchief']['app_content_page']
		| ContentPageQueryTypes['GetNlParentContentPagesByTitleQueryAvo']['app_content']
		| ContentPageQueryTypes['GetNlParentContentPagesByTitleQueryHetArchief']['app_content_page']
		| null
	> {
		if (title) {
			return this.contentPagesService.getNlParentContentPagesByTitle(title, limit);
		} else {
			return this.contentPagesService.getNlParentContentPages(limit);
		}
	}

	@Get('public')
	@RequireAnyPermissions(
		PermissionName.EDIT_CONTENT_PAGE_LABELS,
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_OWN_CONTENT_PAGES
	)
	public async getPublicContentItems(
		@Query('limit', ParseIntPipe) limit: number,
		@Query('title') title: string | undefined
	): Promise<
		| ContentPageQueryTypes['GetContentPagesQueryAvo']['app_content']
		| ContentPageQueryTypes['GetContentPagesQueryHetArchief']['app_content_page']
		| ContentPageQueryTypes['GetPublicContentPagesByTitleQueryAvo']['app_content']
		| ContentPageQueryTypes['GetPublicContentPagesByTitleQueryHetArchief']['app_content_page']
		| null
	> {
		if (title) {
			return this.contentPagesService.getPublicContentItemsByTitle(title, limit);
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
		PermissionName.EDIT_INTERACTIVE_TOURS
	)
	public async getPublicProjectContentItems(
		@Query('limit', ParseIntPipe) limit: number,
		@Query('title') title: string | undefined
	): Promise<
		| ContentPageQueryTypes['GetPublicProjectContentPagesQueryAvo']['app_content']
		| ContentPageQueryTypes['GetPublicProjectContentPagesQueryHetArchief']['app_content_page']
	> {
		if (title) {
			return this.contentPagesService.getPublicProjectContentItemsByTitle(title, limit);
		} else {
			return this.contentPagesService.getPublicProjectContentItems(limit);
		}
	}

	@Get('labels')
	@RequireAnyPermissions(
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_OWN_CONTENT_PAGES
	)
	public async fetchLabelsByContentType(
		@Query('contentType') contentType: string
	): Promise<ContentPageLabel[]> {
		return this.contentPagesService.fetchLabelsByContentType(contentType);
	}

	@Put('labels')
	@RequireAnyPermissions(
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_OWN_CONTENT_PAGES
	)
	public async insertContentLabelsLinks(
		@Body()
		body: {
			contentPageId: number | string; // Numeric ids in avo, uuid's in hetarchief. We would like to switch to uuids for avo as well at some point
			labelIds: (number | string)[];
		},
		@SessionUser() user: SessionUserEntity
	): Promise<void> {
		if (!body.labelIds?.length) {
			return;
		}
		if (!user.has(PermissionName.EDIT_ANY_CONTENT_PAGES)) {
			const contentPage = await this.contentPagesService.getContentPageById(
				String(body.contentPageId)
			);
			if (contentPage.userProfileId !== user.getId()) {
				// User cannot add labels to other peoples pages
				throw new ForbiddenException(
					"You're not allowed to add labels to content pages that you do not own"
				);
			}
		}

		// Delete before inserting to avoid foreign key duplicate exceptions
		await this.contentPagesService.deleteContentLabelsLinks(body.contentPageId, body.labelIds);
		await this.contentPagesService.insertContentLabelsLinks(body.contentPageId, body.labelIds);
	}

	@Delete('labels')
	@RequireAnyPermissions(
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_OWN_CONTENT_PAGES
	)
	public async deleteContentLabelsLinks(
		@Body()
		body: {
			contentPageId: number | string; // Numeric ids in avo, uuid's in hetarchief. We would like to switch to uuids for avo as well at some point
			labelIds: (number | string)[];
		},
		@SessionUser() user: SessionUserEntity
	): Promise<void> {
		if (!body.labelIds?.length) {
			return;
		}
		if (!user.has(PermissionName.EDIT_ANY_CONTENT_PAGES)) {
			const contentPage = await this.contentPagesService.getContentPageById(
				String(body.contentPageId)
			);
			if (contentPage.userProfileId !== user.getId()) {
				// User cannot add labels to other peoples pages
				throw new ForbiddenException(
					"You're not allowed to add labels to content pages that you do not own"
				);
			}
		}
		await this.contentPagesService.deleteContentLabelsLinks(body.contentPageId, body.labelIds);
	}

	@Get('types')
	@RequireAnyPermissions(
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_OWN_CONTENT_PAGES
	)
	public async getContentTypes(): Promise<
		{ value: Avo.ContentPage.Type; label: string }[] | null
	> {
		return this.contentPagesService.getContentTypes();
	}

	@Put()
	@RequireAnyPermissions(
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_OWN_CONTENT_PAGES
	)
	public async insertContentPage(
		@Body() contentPage: DbContentPage,
		@SessionUser() user: SessionUserEntity
	): Promise<DbContentPage | null> {
		if (
			!user.has(PermissionName.EDIT_ANY_CONTENT_PAGES) &&
			(!user.getProfileId() || contentPage.userProfileId !== user.getProfileId())
		) {
			// User cannot edit other peoples pages
			throw new ForbiddenException(
				"You're not allowed to create content pages for other people"
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
		PermissionName.EDIT_OWN_CONTENT_PAGES
	)
	public async updateContentPage(
		@Body()
		body: {
			contentPage: DbContentPage;
		},
		@SessionUser() user: SessionUserEntity
	): Promise<DbContentPage | null> {
		if (
			!user.has(PermissionName.EDIT_ANY_CONTENT_PAGES) &&
			body.contentPage.userProfileId !== user.getProfileId()
		) {
			// User cannot edit other peoples pages
			throw new ForbiddenException(
				"You're not allowed to edit content pages that you do not own"
			);
		}
		return this.contentPagesService.updateContentPage(body.contentPage);
	}

	@Delete(':id')
	@RequireAnyPermissions(PermissionName.DELETE_ANY_CONTENT_PAGES)
	public async deleteContentPage(@Param('id') id: string): Promise<void> {
		await this.contentPagesService.deleteContentPage(id);
	}

	@Get('access')
	@RequireAnyPermissions(PermissionName.EDIT_NAVIGATION_BARS)
	public async getUserGroupsFromContentPage(
		@Query('path') path: string
	): Promise<(string | number)[]> {
		return this.contentPagesService.getUserGroupsFromContentPage(path);
	}

	/**
	 * This function will accept an id of an existing content page
	 * fetch the content page
	 * duplicate the content page including all its assets
	 * and return the resulting content page
	 * @param id
	 * @param overrideValues
	 * @param user
	 */
	@Post('/:id/duplicate')
	@RequireAnyPermissions(
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_OWN_CONTENT_PAGES
	)
	async duplicateContentPageImages(
		@Param('id') id: string,
		@Body() overrideValues: Partial<DbContentPage>,
		@SessionUser() user: SessionUserEntity
	): Promise<DbContentPage> {
		try {
			const dbContentPage: DbContentPage | null =
				await this.contentPagesService.getContentPageById(id);
			if (!dbContentPage) {
				throw new NotFoundException({
					message: 'Failed to duplicate content page images, because id was not found',
					innerException: null,
					additionalInfo: {
						id,
					},
				});
			}

			let contentToInsert = await this.assetsService.duplicateAssetsInJsonBlob(
				dbContentPage,
				user.getProfileId(),
				AssetType.CONTENT_PAGE_IMAGE
			);

			contentToInsert = {
				...contentToInsert,
				...overrideValues,
			};

			// update attributes specific to duplicate
			contentToInsert.isPublic = false;
			contentToInsert.publishedAt = null;
			contentToInsert.depublishAt = null;
			contentToInsert.publishAt = null;
			contentToInsert.path = null;
			contentToInsert.createdAt = new Date().toISOString();
			contentToInsert.updatedAt = contentToInsert.createdAt;
			contentToInsert.userProfileId = user.getProfileId();

			try {
				contentToInsert.title = await this.contentPagesService.getCopyTitleForContentPage(
					CONTENT_PAGE_COPY,
					CONTENT_PAGE_COPY_REGEX,
					contentToInsert.title
				);
			} catch (err) {
				const customError = new CustomError(
					'Failed to retrieve title for duplicate content page',
					err,
					{
						contentToInsert,
					}
				);

				console.error(customError);

				// fallback to simple copy title
				contentToInsert.title = `${CONTENT_PAGE_COPY.replace(' %index%', '')}${
					contentToInsert.title
				}`;
			}

			// insert duplicated collection
			return await this.contentPagesService.insertContentPage(contentToInsert);
		} catch (err) {
			logAndThrow(
				new InternalServerErrorException({
					message: 'Failed to duplicate content page',
					innerException: err,
					additionalInfo: {
						id,
						overrideValues,
						profileId: user?.getProfileId(),
					},
				})
			);
		}
	}

	@Post('/blocks/duplicate')
	@RequireAnyPermissions(
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_OWN_CONTENT_PAGES
	)
	async duplicateContentBlockImages(
		@Body() contentBlockJson: any,
		@SessionUser() user: SessionUserEntity
	): Promise<DbContentPage> {
		try {
			console.log(
				'duplicating assets in content block for user profile: ' + user.getProfileId()
			);
			// TODO switch owner to the content page id. But to do this for new content pages that do not have an id yes, we need to create a temp content page (is_temp=true) that we delete again if the page is never saved
			return await this.assetsService.duplicateAssetsInJsonBlob(
				contentBlockJson,
				user.getProfileId(),
				AssetType.CONTENT_PAGE_IMAGE
			);
		} catch (err) {
			logAndThrow(
				new InternalServerErrorException({
					message: 'Failed to duplicate assets in content block json',
					innerException: err,
					additionalInfo: {
						contentBlockJson,
					},
				})
			);
		}
	}

	@Get(':id')
	@RequireAnyPermissions(
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_OWN_CONTENT_PAGES
	)
	public async getContentPageById(@Param('id') id: string): Promise<DbContentPage> {
		try {
			return await this.contentPagesService.getContentPageById(id);
		} catch (err: any) {
			if (err?.response?.additionalInfo?.code === 'NOT_FOUND') {
				throw new NotFoundException('The content page with id was not found');
			}
			throw err;
		}
	}
}
