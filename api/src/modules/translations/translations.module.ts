import { CacheModule, Module } from '@nestjs/common';

import { TranslationsController } from './controllers/translations.controller';
import { TranslationsService } from './services/translations.service';

import { SiteVariablesModule } from '../site-variables';

@Module({
	controllers: [TranslationsController],
	imports: [SiteVariablesModule, CacheModule.register()],
	providers: [TranslationsService],
	exports: [TranslationsService],
})
export class AdminTranslationsModule {}
