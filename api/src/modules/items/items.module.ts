import { forwardRef, Module } from '@nestjs/common';

import { AdminOrganisationsModule } from '../organisations';
import { PlayerTicketModule } from '../player-ticket';
import { DataModule } from '../data';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

@Module({
	controllers: [ItemsController],
	imports: [
		PlayerTicketModule,
		AdminOrganisationsModule,
		forwardRef(() => DataModule),
	],
	providers: [ItemsService],
	exports: [ItemsService],
})
export class ItemsModule {}
