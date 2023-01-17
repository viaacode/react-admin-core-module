import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Put,
	Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Avo } from '@viaa/avo2-types';
import { ContentPageLabel, LabelObj } from '../content-pages';
import { ContentLabelsRequestDto } from '../content-pages/dto/content-labels-request.dto';

import { CustomError } from '../shared/helpers/custom-error';
import { ContentPageLabelsService } from './content-page-labels.service';
import { ContentPageLabelOverviewTableCols } from './content-page-labels.types';
import { ContentPageLabelDto } from './dto/content-page-label.dto';

@ApiTags('ContentPageLabels')
@Controller(process.env.ADMIN_CORE_ROUTES_PREFIX + '/content-page-labels')
export class ContentPageLabelsController {
	constructor(private contentPageLabelService: ContentPageLabelsService) {
	}

	@Get('')
	public async fetchContentPageLabels(
		@Query('offset') offset: string,
		@Query('limit') limit: string,
		@Query('sortColumn') sortColumn: ContentPageLabelOverviewTableCols,
		@Query('sortOrder') sortOrder: Avo.Search.OrderDirection,
		@Query('where') where: string,
	): Promise<[ContentPageLabel[], number]> {
		try {
			return this.contentPageLabelService.fetchContentPageLabels(
				parseInt(offset || '0'),
				parseInt(limit || '20'),
				sortColumn,
				sortOrder,
				JSON.parse(where),
			);
		} catch (err) {
			throw CustomError(
				'Failed to get content page labels from the database',
				err,
				{
					offset,
					limit,
					sortColumn,
					sortOrder,
					where,
				},
			);
		}
	}

	@Get(':id')
	public async fetchContentPageLabelById(
		@Param('id') id: string,
	): Promise<ContentPageLabel> {
		try {
			return this.contentPageLabelService.fetchContentPageLabelById(id);
		} catch (err) {
			throw CustomError(
				'Failed to get content page label from the database',
				err,
				{
					id,
				},
			);
		}
	}

	@ApiOperation({ description: 'Insert one content page label' })
	@ApiResponse({
		status: 200,
		description: 'Returns the id of the newly created content page label',
		type: ContentPageLabelDto,
		isArray: false,
	})
	@Put('')
	public async insertContentPageLabel(
		@Body() contentPageLabel: ContentPageLabelDto,
	): Promise<ContentPageLabelDto> {
		try {
			return this.contentPageLabelService.insertContentPageLabel(
				contentPageLabel,
			);
		} catch (err) {
			throw CustomError(
				'Failed to insert content page label in the database',
				err,
				{
					contentPageLabel,
				},
			);
		}
	}

	@Patch('')
	async updateContentPageLabel(@Body() contentPageLabelInfo: ContentPageLabel) {
		try {
			return this.contentPageLabelService.updateContentPageLabel(
				contentPageLabelInfo,
			);
		} catch (err) {
			throw CustomError(
				'Failed to update content page label in the database',
				err,
				{
					contentPageLabel: contentPageLabelInfo,
				},
			);
		}
	}

	@Delete(':id')
	public async deleteContentPageLabelById(
		@Param('id') id: string,
	): Promise<{ message: 'success' }> {
		try {
			await this.contentPageLabelService.deleteContentPageLabel(id);
			return { message: 'success' };
		} catch (err) {
			throw CustomError(
				'Failed to delete the content page label from the database',
				err,
				{
					id,
				},
			);
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
	async getContentPageLabelsByType(
		@Body() body: ContentLabelsRequestDto,
	): Promise<LabelObj[]> {
		if ((body as any).labelIds) {
			return await this.contentPageLabelService.getContentPageLabelsByTypeAndIds(
				body.contentType,
				(body as any).labelIds,
			);
		}

		// else labels query param is set
		return await this.contentPageLabelService.getContentPageLabelsByTypeAndLabels(
			body.contentType,
			(body as any).labels,
		);
	}
}
