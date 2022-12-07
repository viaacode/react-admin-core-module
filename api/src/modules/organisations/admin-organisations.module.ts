import { forwardRef, Module } from '@nestjs/common';

import { AdminOrganisationsService } from './services/admin-organisations.service';
import { AdminOrganisationsController } from './admin-organisations.controller';
import { DataModule } from '../data';

@Module({
	controllers: [AdminOrganisationsController],
	imports: [forwardRef(() => DataModule)],
	providers: [AdminOrganisationsService],
	exports: [AdminOrganisationsService],
})
export class AdminOrganisationsModule {}
