import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PlayerTicketModule } from '../player-ticket';
import { AdminTranslationsModule } from '../translations';

import { VideoStillsController } from './video-stills.controller';
import { VideoStillsService } from './video-stills.service';

@Module({
	controllers: [VideoStillsController],
	imports: [PlayerTicketModule, AdminTranslationsModule, ConfigModule],
	providers: [VideoStillsService, VideoStillsController],
	exports: [VideoStillsService, VideoStillsController],
})
export class VideoStillsModule {}
