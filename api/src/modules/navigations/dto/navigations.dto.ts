import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { ContentPickerTypesEnum, NavigationItem } from '../navigations.types';

export class CreateNavigationDto implements Partial<NavigationItem> {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The label for this navigation item',
	})
	label?: string;

	@IsString()
	@ApiProperty({
		type: String,
		description: 'The icon for this navigation item',
		default: '',
	})
	iconName: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The description for this navigation item',
	})
	description?: string;

	@IsArray()
	@IsOptional()
	@IsString({ each: true })
	@ApiPropertyOptional({
		type: String,
		description: 'The user group ids allowed to see this navigation item',
	})
	userGroupIds?: Array<string>;

	@ApiProperty({
		required: false,
		enum: ContentPickerTypesEnum,
		description: `The content_type for this item. Options are: ${Object.values(
			ContentPickerTypesEnum,
		).join(', ')}`,
	})
	@IsOptional()
	@IsEnum(ContentPickerTypesEnum, {
		message: `content_type must be one of: ${Object.values(
			ContentPickerTypesEnum,
		).join(', ')}`,
	})
	contentType?: ContentPickerTypesEnum;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The content path for this navigation item, e.g. /help',
	})
	contentPath?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The link target property for this item, e.g. _blank or _self',
	})
	linkTarget?: string;

	@IsNumber()
	@Type(() => Number)
	@ApiProperty({
		type: Number,
		description:
			'The position of this navigation item. Items are sorted by position.',
	})
	position: number;

	@IsString()
	@ApiProperty({
		type: String,
		description: 'The placement for this menu item: e.g. footer-links',
	})
	placement: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The tooltip shown for this menu item',
	})
	tooltip?: string;
}

export class UpdateNavigationDto implements Partial<NavigationItem> {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The label for this navigation item',
	})
	label?: string;

	@IsString()
	@IsOptional()
	@ApiProperty({
		type: String,
		description: 'The icon for this navigation item',
		default: '',
	})
	iconName: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The description for this navigation item',
	})
	description?: string;

	@IsArray()
	@IsOptional()
	@IsString({ each: true })
	@ApiPropertyOptional({
		type: String,
		description: 'The user group ids allowed to see this navigation item',
	})
	userGroupIds?: Array<string>;

	@ApiProperty({
		required: false,
		enum: ContentPickerTypesEnum,
		description: `The content_type for this item. Options are: ${Object.values(
			ContentPickerTypesEnum,
		).join(', ')}`,
	})
	@IsOptional()
	@IsEnum(ContentPickerTypesEnum, {
		message: `content_type must be one of: ${Object.values(
			ContentPickerTypesEnum,
		).join(', ')}`,
	})
	contentType?: ContentPickerTypesEnum;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The content path for this navigation item, e.g. /help',
	})
	contentPath?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The link target property for this item, e.g. _blank or _self',
	})
	linkTarget?: string;

	@IsNumber()
	@Type(() => Number)
	@ApiProperty({
		type: Number,
		description:
			'The position of this navigation item. Items are sorted by position.',
	})
	position: number;

	@IsString()
	@ApiProperty({
		type: String,
		description: 'The placement for this menu item: e.g. footer-links',
	})
	placement: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The tooltip shown for this menu item',
	})
	tooltip?: string;
}
