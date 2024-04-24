import { CacheModule, Module } from '@nestjs/common';
import { DataModule } from '../data';

import { TranslationsController } from './controllers/translations.controller';
import { TranslationsService } from './services/translations.service';

import { SiteVariablesModule } from '../site-variables';

@Module({
	controllers: [TranslationsController],
	imports: [SiteVariablesModule, DataModule, CacheModule.register()],
	providers: [TranslationsService],
	exports: [TranslationsService],
})
export class AdminTranslationsModule {}
