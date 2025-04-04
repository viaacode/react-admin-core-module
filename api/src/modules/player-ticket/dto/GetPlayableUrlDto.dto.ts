import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetPlayableUrlDto {
	@IsString()
	@IsOptional()
	@ApiProperty({
		type: String,
		description:
			'The external id (avo) or SchemaIdentifier (hetarchief) of the media item you want to view. externalId, externalIds or browsePath is required.',
		example: '8k74t8bn2s',
		required: false,
	})
	externalId: string | undefined;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description:
			'Comma separated list of external ids (avo) or SchemaIdentifiers (hetarchief) of the media items you want to view. externalId, externalIds or browsePath is required.',
		example: '8k74t8bn2s,rx9380v41s,3n20c62616',
		required: false,
	})
	externalIds: string | undefined;

	@IsString()
	@IsOptional()
	@ApiProperty({
		type: String,
		description:
			'The browse path of the media item you want to view. externalId, externalIds or browsePath is required.',
		example:
			'https://media.viaa.be/play/v2/TESTBEELD/78ee1e6127e2439b8f1a1815e61033bf322499cdd71f421bafc21330ff670e81/browse.mp4',
		required: false,
	})
	browsePath: string | undefined;
}
