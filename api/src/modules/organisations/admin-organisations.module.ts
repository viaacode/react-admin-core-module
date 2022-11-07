import { forwardRef, Module } from '@nestjs/common';

import { AdminOrganisationsService } from './services/admin-organisations.service';

import { DataModule } from '../data';

@Module({
	controllers: [],
	imports: [forwardRef(() => DataModule)],
	providers: [AdminOrganisationsService],
	exports: [AdminOrganisationsService],
})
export class AdminOrganisationsModule {}
