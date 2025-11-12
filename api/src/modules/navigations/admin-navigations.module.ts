import { forwardRef, Module } from '@nestjs/common'

import { DataModule } from '../data'

import { AdminNavigationsController } from './controllers/admin-navigations.controller'
import { AdminNavigationsService } from './services/admin-navigations.service'

@Module({
	controllers: [AdminNavigationsController],
	imports: [forwardRef(() => DataModule)],
	providers: [AdminNavigationsService],
	exports: [AdminNavigationsService],
})
export class AdminNavigationsModule {}
