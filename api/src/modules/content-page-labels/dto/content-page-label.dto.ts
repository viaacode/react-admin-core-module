import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

import type { ContentPageType, ContentPickerType } from '../../content-pages';
import { LinkTarget } from '../../navigations';
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
		enum: Object.values(LinkTarget),
		default: LinkTarget.SELF,
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

	// Only exists on hetarchief, avo has no color on its content page labels
	@IsString()
	@IsOptional()
	@ApiProperty({
		type: String,
		required: false,
	})
	color?: string;

	// Only exists on hetarchief: id of the dutch version of this label (ARC-4200)
	@IsString()
	@IsOptional()
	@ApiProperty({
		type: String,
		required: false,
		nullable: true,
		description: 'The id of the dutch version of this label. Only exists on hetarchief',
	})
	nl_parent_label_id?: string | null;

	// Only exists on hetarchief and only for dutch labels:
	// the ids of the labels in other languages that are translations of this label (ARC-4200)
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	@ApiProperty({
		type: String,
		isArray: true,
		required: false,
		description:
			'Only for dutch labels on hetarchief: the ids of the labels in other languages that are translations of this label. Undefined leaves the links unchanged',
	})
	translated_label_ids?: string[];
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

	// Only exists on hetarchief, avo has no color on its content page labels
	@IsString()
	@IsOptional()
	@ApiProperty({
		type: String,
		required: false,
	})
	color?: string;

	// Only exists on hetarchief: id of the dutch version of this label (ARC-4200)
	@IsString()
	@IsOptional()
	@ApiProperty({
		type: String,
		required: false,
		nullable: true,
		description: 'The id of the dutch version of this label. Only exists on hetarchief',
	})
	nl_parent_label_id?: string | null;

	// Only exists on hetarchief and only for dutch labels:
	// the ids of the labels in other languages that are translations of this label (ARC-4200)
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	@ApiProperty({
		type: String,
		isArray: true,
		required: false,
		description:
			'Only for dutch labels on hetarchief: the ids of the labels in other languages that are translations of this label. Undefined leaves the links unchanged',
	})
	translated_label_ids?: string[];
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

	// Only exists on hetarchief, avo has no color on its content page labels
	@IsString()
	@IsOptional()
	@ApiProperty({
		type: String,
		required: false,
	})
	color?: string;

	// Only exists on hetarchief: id of the dutch version of this label (ARC-4200)
	@IsString()
	@IsOptional()
	@ApiProperty({
		type: String,
		required: false,
		nullable: true,
		description: 'The id of the dutch version of this label. Only exists on hetarchief',
	})
	nl_parent_label_id?: string | null;

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

export class TranslateContentPageLabelsDto {
	@IsArray()
	@IsString({ each: true })
	@ApiProperty({
		type: String,
		isArray: true,
		description:
			'The label values to translate, eg: the label query param of a page overview block',
		example: ['Achter de schermen'],
	})
	labels: string[];

	@IsEnum(Locale)
	@ApiProperty({
		type: String,
		enum: Locale,
		description: 'The language of the given labels',
		example: Locale.Nl,
	})
	fromLanguage: Locale;

	@IsEnum(Locale)
	@ApiProperty({
		type: String,
		enum: Locale,
		description: 'The language to translate the labels to',
		example: Locale.En,
	})
	toLanguage: Locale;
}
