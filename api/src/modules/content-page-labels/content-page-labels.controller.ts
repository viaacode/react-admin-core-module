import { Body, Controller, Get, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Avo } from '@viaa/avo2-types';
import { ContentPageLabel, LabelObj } from '../content-pages';
import { ContentLabelsRequestDto } from '../content-pages/dto/content-labels-request.dto';

import { CustomError } from '../shared/helpers/custom-error';
import { ContentPageLabelsService } from './content-page-labels.service';
import { ContentPageLabelOverviewTableCols } from './content-page-labels.types';

@ApiTags('ContentPageLabels')
@Controller(process.env.ADMIN_CORE_ROUTES_PREFIX + '/content-page-labels')
export class ContentPageLabelsController {
	constructor(private contentPageLabelService: ContentPageLabelsService) {}

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

	@Put('')
	public async insertContentPageLabel(
		@Body() contentPageLabel: ContentPageLabel,
	): Promise<number> {
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
