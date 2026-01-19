import { Module } from '@nestjs/common';

import { MediahavenService } from './services/mediahaven.service';

@Module({
	providers: [MediahavenService],
	exports: [MediahavenService],
})
export class MediahavenModule {}
