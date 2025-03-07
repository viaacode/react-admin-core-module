import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Avo } from '@viaa/avo2-types';
import { PermissionName } from '@viaa/avo2-types';

import { ContentPageLabel, LabelObj } from '../../content-pages';
import { ContentLabelsRequestDto } from '../../content-pages/dto/content-labels-request.dto';
import { RequireAnyPermissions } from '../../shared/decorators/require-any-permissions.decorator';
import { customError } from '../../shared/helpers/custom-error';
import { ContentPageLabelOverviewTableCols } from '../content-page-labels.types';
import {
	ContentPageLabelDto,
	InsertContentPageLabelDto,
	UpdateContentPageLabelDto,
} from '../dto/content-page-label.dto';
import { ContentPageLabelsService } from '../services/content-page-labels.service';

@ApiTags('ContentPageLabels')
@Controller(process.env.ADMIN_CORE_ROUTES_PREFIX + '/content-page-labels')
export class ContentPageLabelsController {
	constructor(private contentPageLabelService: ContentPageLabelsService) {}

	@Get('')
	@RequireAnyPermissions(
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_OWN_CONTENT_PAGES,
		PermissionName.EDIT_CONTENT_PAGE_LABELS
	)
	public async fetchContentPageLabels(
		@Query('offset') offset: string,
		@Query('limit') limit: string,
		@Query('sortColumn') sortColumn: ContentPageLabelOverviewTableCols,
		@Query('sortOrder') sortOrder: Avo.Search.OrderDirection,
		@Query('where') where: string
	): Promise<[ContentPageLabel[], number]> {
		try {
			return this.contentPageLabelService.fetchContentPageLabels(
				parseInt(offset || '0'),
				parseInt(limit || '20'),
				sortColumn,
				sortOrder,
				JSON.parse(where)
			);
		} catch (err: any) {
			throw customError('Failed to get content page labels from the database', err, {
				offset,
				limit,
				sortColumn,
				sortOrder,
				where,
			});
		}
	}

	// Allowed for any user
	@Get(':id')
	public async fetchContentPageLabelById(@Param('id') id: string): Promise<ContentPageLabel> {
		try {
			return this.contentPageLabelService.fetchContentPageLabelById(id);
		} catch (err: any) {
			throw customError('Failed to get content page label from the database', err, {
				id,
			});
		}
	}

	@ApiOperation({ description: 'Insert content page labels' })
	@ApiResponse({
		status: 200,
		description: 'Returns the newly created content page labels',
		type: ContentPageLabelDto,
		isArray: false,
	})
	@Put('')
	@RequireAnyPermissions(PermissionName.EDIT_CONTENT_PAGE_LABELS)
	public async insertContentPageLabels(
		@Body() contentPageLabels: InsertContentPageLabelDto[]
	): Promise<ContentPageLabelDto[]> {
		try {
			return this.contentPageLabelService.insertContentPageLabels(contentPageLabels);
		} catch (err: any) {
			throw customError('Failed to insert content page labels in the database', err, {
				contentPageLabels,
			});
		}
	}

	@Patch('')
	@RequireAnyPermissions(PermissionName.EDIT_CONTENT_PAGE_LABELS)
	async updateContentPageLabel(@Body() contentPageLabelInfo: UpdateContentPageLabelDto) {
		try {
			return this.contentPageLabelService.updateContentPageLabel(contentPageLabelInfo);
		} catch (err: any) {
			throw customError('Failed to update content page label in the database', err, {
				contentPageLabel: contentPageLabelInfo,
			});
		}
	}

	@Delete(':id')
	@RequireAnyPermissions(PermissionName.EDIT_CONTENT_PAGE_LABELS)
	public async deleteContentPageLabelById(
		@Param('id') id: string
	): Promise<{ message: 'success' }> {
		try {
			await this.contentPageLabelService.deleteContentPageLabel(id);
			return { message: 'success' };
		} catch (err: any) {
			throw customError('Failed to delete the content page label from the database', err, {
				id,
			});
		}
	}

	@ApiOperation({ description: 'Get content page labels with filters' })
	@ApiResponse({
		status: 200,
		description: 'Returns list of label objects',
		type: ContentPageLabelDto,
		isArray: true,
	})
	@Post('')
	async getContentPageLabelsByType(@Body() body: ContentLabelsRequestDto): Promise<LabelObj[]> {
		if ((body as any).labelIds) {
			return await this.contentPageLabelService.getContentPageLabelsByTypeAndIds(
				body.contentType,
				(body as any).labelIds
			);
		}

		// else labels query param is set
		return await this.contentPageLabelService.getContentPageLabelsByTypeAndLabels(
			body.contentType,
			(body as any).labels
		);
	}
}
