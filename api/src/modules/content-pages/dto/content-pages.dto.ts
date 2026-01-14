import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

import { commaSeparatedStringToArray } from '../../shared/helpers/comma-separated-string-to-array';
import { SortDirection } from '../../shared/types';

export class ContentPageOverviewParams {
	@IsBoolean()
	@Type(() => Boolean)
	@IsOptional()
	@ApiPropertyOptional({
		type: Boolean,
		description: 'Also include the content blocks for each page',
		default: false,
	})
	withBlocks? = false;

	@IsString()
	@ApiProperty({
		type: String,
		description: 'Type of the content pages you want to fetch. eg: PAGINA, FAQ_ITEM, ...',
		example: 'FAQ_ITEM',
	})
	contentType: string;

	@IsArray()
	@IsOptional()
	@Transform(commaSeparatedStringToArray)
	@ApiPropertyOptional({
		type: String,
		description:
			'Visible tabs in the page overview component for which we should fetch item counts',
		required: false,
		example: ['69ccef3b-751a-4be4-95bc-5ef365fbd504'],
	})
	labelIds?: (string | number)[];

	@IsArray()
	@IsOptional()
	@Transform(commaSeparatedStringToArray)
	@ApiPropertyOptional({
		type: String,
		description: 'Selected tabs for which we should fetch content page items',
		required: false,
		example: ['69ccef3b-751a-4be4-95bc-5ef365fbd504'],
	})
	selectedLabelIds?: (string | number)[];

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'property to sort the results by',
		default: 'title_lower',
		enum: [
			'id',
			'title',
			'description',
			'is_public',
			'publish_at',
			'depublish_at',
			'created_at',
			'updated_at',
			'is_protected',
			'content_type',
			'user_profile_id',
			'path',
			'user_group_ids',
			'content_width',
			'thumbnail_path',
			'header_path',
			'seo_title',
			'seo_description',
			'seo_keywords',
			'published_at',
			'depublished_at',
			'meta_description',
			'updated_by_profile_id',
			'is_deleted',
			'seo_image_path',
		],
	})
	orderProp? = 'title';

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Direction to sort in. either desc or asc',
		default: SortDirection.asc,
		enum: SortDirection,
	})
	orderDirection? = SortDirection.asc;

	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	@ApiPropertyOptional({
		type: Number,
		description: 'How many results to skip before returning the results',
		default: 0,
	})
	offset? = 0;

	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	@ApiPropertyOptional({
		type: Number,
		description: 'The max. number of results to return',
		default: 10,
	})
	limit? = 10;
}
