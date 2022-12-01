import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DataService } from './services/data.service';

@Module({
	controllers: [],
	imports: [ConfigModule],
	providers: [DataService],
	exports: [DataService],
})
export class DataModule {}
