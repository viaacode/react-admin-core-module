import { forwardRef, Module } from '@nestjs/common';

import { DataModule } from '../data';
import { AdminOrganisationsModule } from '../organisations';
import { PlayerTicketModule } from '../player-ticket';

import { CollectionsController } from './controllers/collections.controller';
import { CollectionsService } from './services/collections.service';

@Module({
	controllers: [CollectionsController],
	imports: [PlayerTicketModule, AdminOrganisationsModule, forwardRef(() => DataModule)],
	providers: [CollectionsService],
	exports: [CollectionsService],
})
export class CollectionsModule {}
