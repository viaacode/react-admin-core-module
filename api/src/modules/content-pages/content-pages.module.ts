import { forwardRef, Module } from '@nestjs/common';

import { ContentPagesController } from './controllers/content-pages.controller';
import { ContentPagesService } from './services/content-pages.service';

import { AdminOrganisationsModule } from '../organisations';
import { PlayerTicketModule } from '../player-ticket';
import { DataModule } from '../data';

@Module({
	controllers: [ContentPagesController],
	imports: [
		PlayerTicketModule,
		AdminOrganisationsModule,
		forwardRef(() => DataModule),
	],
	providers: [ContentPagesService],
	exports: [ContentPagesService],
})
export class ContentPagesModule {}
