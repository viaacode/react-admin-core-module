import { forwardRef, Module } from '@nestjs/common'

import { DataModule } from '../data'

import { ContentPageLabelsController } from './controllers/content-page-labels.controller'
import { ContentPageLabelsService } from './services/content-page-labels.service'

@Module({
	controllers: [ContentPageLabelsController],
	imports: [forwardRef(() => DataModule)],
	providers: [ContentPageLabelsService],
	exports: [ContentPageLabelsService],
})
export class ContentPageLabelsModule {}
