import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DataModule } from '../data';
import { AdminTranslationsModule } from '../translations';

import { AssetsController } from './controllers/assets.controller';
import { AssetsService } from './services/assets.service';

@Module({
	imports: [ConfigModule, AdminTranslationsModule, DataModule],
	controllers: [AssetsController],
	providers: [AssetsService],
	exports: [AssetsService],
})
export class AssetsModule {}
