import { ApiProperty } from '@nestjs/swagger';
import { Avo } from '@viaa/avo2-types';
import { IsString } from 'class-validator';

export class ContentPageTypeDto {
	@IsString()
	@ApiProperty()
	value: Avo.ContentPage.Type;

	@IsString()
	@ApiProperty()
	label: string;
}
