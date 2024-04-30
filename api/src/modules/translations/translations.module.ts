import { CacheModule, Module } from '@nestjs/common';
import { DataModule } from '../data';

import { SiteVariablesModule } from '../site-variables';

import { TranslationsController } from './controllers/translations.controller';
import { TranslationsService } from './services/translations.service';

@Module({
	controllers: [TranslationsController],
	imports: [DataModule, CacheModule.register()],
	providers: [TranslationsService],
	exports: [TranslationsService],
})
export class AdminTranslationsModule {}
