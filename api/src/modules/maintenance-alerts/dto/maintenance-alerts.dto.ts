import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateMaintenanceAlertDto {
	@IsString()
	@Type(() => String)
	@ApiProperty({
		type: String,
		description: 'The title of the maintenance alert',
		example: 'Gepland onderhoud'
	})
	title: string;

	@IsString()
	@Type(() => String)
	@ApiProperty({
		type: String,
		description: 'The message of the maintenance alert',
		example: 'Opgelet! Tussen 25 en 27 februari plannen we een onderhoud aan Het archief.'
	})
	message: string;

	@IsString()
	@Type(() => String)
	@ApiProperty({
		type: String,
		description: 'The icon of the maintenance alert',
		example: 'alert'
	})
	icon: string;

	@IsArray()
	@IsString({ each: true})
	@Type(() => String)
	@ApiProperty({
		type: String,
		description: 'The title of the maintenance alert',
		example: ['1a1bd2fa-535d-49e3-8a1d-3d8564edafff']
	})
	userGroups: string[];

	@IsString()
	@Type(() => String)
	@ApiProperty({
		type: String,
		description: 'The start date the maintenance alert should be shown',
		example: '2022-02-25T16:36:06.045845'
	})
	fromDate: string;

	@IsString()
	@Type(() => String)
	@ApiProperty({
		type: String,
		description: 'The end date the maintenance alert should be shown',
		example: '2022-02-27T16:36:06.045845'
	})
	untilDate: string;

	@IsBoolean()
	@Type(() => Boolean)
	@ApiProperty({
		type: Boolean,
		description: 'Determine if the maintenance alert is active or not',
		example: true
	})
	active: boolean;

}

export class UpdateMaintenanceAlertDto {
	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The title of the maintenance alert',
		example: 'Gepland onderhoud'
	})
	title?: string;

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The message of the maintenance alert',
		example: 'Opgelet! Tussen 25 en 27 februari plannen we een onderhoud aan Het archief.'
	})
	message?: string;

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The icon of the maintenance alert',
		example: 'alert'
	})
	icon?: string;

	@IsArray()
	@IsString({ each: true})
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The title of the maintenance alert',
		example: ['1a1bd2fa-535d-49e3-8a1d-3d8564edafff']
	})
	userGroups?: string[];

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The start date the maintenance alert should be shown',
		example: '2022-02-25T16:36:06.045845'
	})
	fromDate?: string;

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The end date the maintenance alert should be shown',
		example: '2022-02-27T16:36:06.045845'
	})
	untilDate?: string;

	@IsBoolean()
	@Type(() => Boolean)
	@IsOptional()
	@ApiPropertyOptional({
		type: Boolean,
		description: 'Determine if the maintenance alert is active or not',
		example: true
	})
	active?: boolean;

}
