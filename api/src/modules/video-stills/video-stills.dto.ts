import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VideoStillRequestDto {
	@ApiPropertyOptional({
		description: 'External ID of the video (for avo) (option 1)',
		example: 'abc123',
		required: false,
	})
	externalId?: string;

	@ApiPropertyOptional({
		description: 'File ID of the video file (for hetarchief) (option 2)',
		example: 'file-456',
		required: false,
	})
	fileId?: string;

	@ApiPropertyOptional({
		description: 'Stored at URL (most efficient, for both) (option 3)',
		example: 'https://storage.example.com/video.mp4',
		required: false,
	})
	storedAt?: string;

	@ApiPropertyOptional({
		description: 'Type of the stills object (option 3)',
		enum: ['video', 'audio', 'image'],
		example: 'video',
		required: false,
	})
	type?: 'video' | 'audio' | 'image';

	@ApiProperty({
		description: 'Start time in milliseconds (option &, 2, 3)',
		example: 15000,
		required: true,
	})
	startTime: number;
}

export class VideoStillRequestBodyDto {
	@ApiProperty({
		description: 'Array of video still requests',
		type: [VideoStillRequestDto],
	})
	requests: VideoStillRequestDto[];
}
