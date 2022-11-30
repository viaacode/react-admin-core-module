import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetPlayableUrlDto {
	@IsString()
	@ApiProperty({
		type: String,
		description:
			'The external id (avo) or SchemaIdentifier (hetarchief) of the media item you want to view. externalId or browsePath is required.',
		example: '8k74t8bn2s',
		required: false,
	})
	externalId: string | undefined;

	@IsString()
	@ApiProperty({
		type: String,
		description:
			'The browse path of the media item you want to view. externalId or browsePath is required.',
		example:
			'https://media.viaa.be/play/v2/TESTBEELD/78ee1e6127e2439b8f1a1815e61033bf322499cdd71f421bafc21330ff670e81/browse.mp4',
		required: false,
	})
	browsePath: string | undefined;

	@IsString()
	@ApiProperty({
		type: String,
		description: 'The website domain you will watch the video on',
		example: 'http://onderwijs.hetarchief.be',
		required: true,
	})
	referrer: string;
}
