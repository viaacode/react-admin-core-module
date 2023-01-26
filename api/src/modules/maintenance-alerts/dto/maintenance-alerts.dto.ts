import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

import { SortDirection } from "../../shared/types";
import { MaintenanceAlertOrderProp } from "../maintenance-alerts.types";

export class MaintenanceAlertsQueryDto {
	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description:
			"Text to search for in the title or message of the maintenance alert. Use '%' for wildcard.",
		default: undefined,
	})
	query?: string;

	@IsArray()
	@IsString({ each: true })
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		isArray: true,
		description: 'List of user group ids',
		default: [],
	})
	userGroupIds?: string[];

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

	@IsBoolean()
	@Type(() => Number)
	@IsOptional()
	@ApiPropertyOptional({
		type: Number,
		description: 'Retrieve active or non active maintenance alerts',
		default: true
	})
	active?: boolean = true;

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
	orderProp? = MaintenanceAlertOrderProp.ACTIVE;

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
