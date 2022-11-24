import { forwardRef, Module } from '@nestjs/common';

import { AdminNavigationsController } from './controllers/admin-navigations.controller';
import { AdminNavigationsService } from './services/admin-navigations.service';

import { DataModule } from '../data/data.module';

@Module({
	controllers: [AdminNavigationsController],
	imports: [forwardRef(() => DataModule)],
	providers: [AdminNavigationsService],
})
export class AdminNavigationsModule {}