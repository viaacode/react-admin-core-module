import { Module } from '@nestjs/common';

import { AdminTranslationsModule } from '../translations';

import { StatusController } from './controllers/status.controller';
import { StatusService } from './services/status.service';

@Module({
	controllers: [StatusController],
	imports: [AdminTranslationsModule],
	providers: [StatusService],
	exports: [StatusService],
})
export class StatusModule {}
