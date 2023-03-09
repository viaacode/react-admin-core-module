import { forwardRef, Module } from '@nestjs/common';

import { ContentPageLabelsController } from './controllers/content-page-labels.controller';
import { ContentPageLabelsService } from './services/content-page-labels.service';

import { DataModule } from '../data';

@Module({
	controllers: [ContentPageLabelsController],
	imports: [forwardRef(() => DataModule)],
	providers: [ContentPageLabelsService],
	exports: [ContentPageLabelsService],
})
export class ContentPageLabelsModule {}
