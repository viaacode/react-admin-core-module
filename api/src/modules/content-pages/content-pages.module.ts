import { forwardRef, Module } from '@nestjs/common'

import { AssetsModule } from '../assets'
import { DataModule } from '../data'
import { PlayerTicketModule } from '../player-ticket'

import { ContentPagesController } from './controllers/content-pages.controller'
import { ContentPagesService } from './services/content-pages.service'

@Module({
	controllers: [ContentPagesController],
	imports: [PlayerTicketModule, AssetsModule, forwardRef(() => DataModule)],
	providers: [ContentPagesService],
	exports: [ContentPagesService],
})
export class ContentPagesModule {}
