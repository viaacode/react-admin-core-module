import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { ContentPageType, ContentPickerType, LinkTarget } from '../../content-pages';
import { Locale } from '../../translations';

export class PickerItemDto {
	@IsString()
	@IsOptional()
	@ApiProperty({
		type: String,
	})
	label?: string;

	@IsString()
	@ApiProperty({
		type: String,
	})
	type: ContentPickerType;

	@IsString()
	@ApiProperty({
		type: String,
	})
	value: string;

	@IsString()
	@ApiProperty({
		type: String,
	})
	target?: LinkTarget;
}

export class InsertContentPageLabelDto {
	@IsString()
	@ApiProperty({
		type: String,
	})
	label: string;

	@IsString()
	@ApiProperty({
		type: String,
	})
	content_type: ContentPageType;

	@IsString()
	@ApiProperty({
		type: String,
		enum: Locale,
	})
	language: Locale;

	@IsString()
	@IsOptional()
	@ApiProperty({
		type: String,
		required: false,
	})
	link_to?: PickerItemDto | null = null;
}

export class UpdateContentPageLabelDto {
	@IsString()
	@ApiProperty({
		type: String,
		description: 'The id of the content page label',
	})
	id: string;

	@IsString()
	@ApiProperty({
		type: String,
	})
	label: string;

	@IsString()
	@ApiProperty({
		type: String,
	})
	content_type: ContentPageType;

	@IsString()
	@ApiProperty({
		type: String,
		enum: Locale,
	})
	language: Locale;

	@IsOptional()
	@ApiProperty({
		required: false,
	})
	link_to?: PickerItemDto | null = null;
}

export class ContentPageLabelDto {
	@IsString()
	@ApiProperty({
		type: String,
		description: 'The id of the content page label',
	})
	id: string;

	@IsString()
	@ApiProperty({
		type: String,
	})
	label: string;

	@IsString()
	@ApiProperty({
		type: String,
	})
	content_type: ContentPageType;

	@IsString()
	@ApiProperty({
		type: String,
	})
	link_to: PickerItemDto | null;

	@IsString()
	@ApiProperty({
		type: String,
		enum: Locale,
	})
	language: Locale;

	@IsString()
	@ApiProperty({
		type: String,
	})
	created_at: string;

	@IsString()
	@ApiProperty({
		type: String,
	})
	updated_at: string;
}
