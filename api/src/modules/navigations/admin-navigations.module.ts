import { forwardRef, Module } from '@nestjs/common';

import { AdminNavigationsController } from './controllers/admin-navigations.controller';
import { AdminNavigationsService } from './services/admin-navigations.service';

import { DataModule } from '../data';

@Module({
	controllers: [AdminNavigationsController],
	imports: [forwardRef(() => DataModule)],
	providers: [AdminNavigationsService],
	exports: [AdminNavigationsService],
})
export class AdminNavigationsModule {}
