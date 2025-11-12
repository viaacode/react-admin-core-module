import { forwardRef, Module } from '@nestjs/common'

import { DataModule } from '../data'

import { AdminOrganisationsController } from './admin-organisations.controller'
import { AdminOrganisationsService } from './services/admin-organisations.service'

@Module({
	controllers: [AdminOrganisationsController],
	imports: [forwardRef(() => DataModule)],
	providers: [AdminOrganisationsService],
	exports: [AdminOrganisationsService],
})
export class AdminOrganisationsModule {}
