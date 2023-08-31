import { forwardRef, Module } from '@nestjs/common';
import { AssetsModule } from '../assets';

import { ContentPagesController } from './controllers/content-pages.controller';
import { ContentPagesService } from './services/content-pages.service';

import { PlayerTicketModule } from '../player-ticket';
import { DataModule } from '../data';

@Module({
	controllers: [ContentPagesController],
	imports: [PlayerTicketModule, AssetsModule, forwardRef(() => DataModule)],
	providers: [ContentPagesService],
	exports: [ContentPagesService],
})
export class ContentPagesModule {}
