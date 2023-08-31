import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataModule } from '../data';

import { AssetsService } from './services/assets.service';

import { AssetsController } from './controllers/assets.controller';
import { AdminTranslationsModule } from '../translations';

@Module({
	imports: [ConfigModule, AdminTranslationsModule, DataModule],
	controllers: [AssetsController],
	providers: [AssetsService],
	exports: [AssetsService],
})
export class AssetsModule {}
