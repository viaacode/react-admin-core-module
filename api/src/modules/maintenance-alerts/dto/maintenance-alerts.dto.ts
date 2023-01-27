import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

import { SortDirection } from "../../shared/types";
import { MaintenanceAlertOrderProp, MaintenanceAlertType } from "../maintenance-alerts.types";

export class MaintenanceAlertsQueryDto {
	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Retrieve maintenance alerts starting from a certain date',
		example: '2022-02-25T16:36:06.045845'
	})
	fromDate?: string;

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Retrieve maintenance alerts going until a certain datd',
		example: '2022-02-25T16:36:06.045845'
	})
	untilDate?: string;

	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	@ApiPropertyOptional({
		type: Number,
		description: 'Which page of results to fetch. Counting starts at 1',
		default: 1,
	})
	page? = 1;

	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	@ApiPropertyOptional({
		type: Number,
		description: 'The max. number of results to return',
		default: 10,
	})
	size? = 10;

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'property to sort the results by',
		default: 'createdAt',
		enum: [Object.values(MaintenanceAlertOrderProp)],
	})
	orderProp? = MaintenanceAlertOrderProp.FROM_DATE;

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Direction to sort in. either desc or asc',
		default: SortDirection.desc,
		enum: [SortDirection.asc, SortDirection.desc],
	})
	orderDirection? = SortDirection.desc;
}

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
	@IsEnum(MaintenanceAlertType)
	@ApiProperty({
		type: String,
		description: 'The type of the maintenance alert, mainly used to determine the icon/styling that should be shown in the UI',
		example: 'alert'
	})
	type: MaintenanceAlertType;

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
	@IsEnum(MaintenanceAlertType)
	@IsOptional()
	@ApiPropertyOptional({
		type: MaintenanceAlertType,
		description: 'The type of the maintenance alert',
		example: 'alert'
	})
	type?: string;

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
}
