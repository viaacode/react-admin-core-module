import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ContentPagesController } from './controllers/content-pages.controller';
import { ContentPagesService } from './services/content-pages.service';

import { AdminOrganisationsModule } from '../organisations/admin-organisations.module';
import { PlayerTicketModule } from '../player-ticket/player-ticket.module';
import { DataModule } from '../data/data.module';

@Module({
	controllers: [ContentPagesController],
	imports: [
		ConfigModule,
		PlayerTicketModule,
		AdminOrganisationsModule,
		forwardRef(() => DataModule),
	],
	providers: [ContentPagesService, ConfigService],
	exports: [ContentPagesService],
})
export class ContentPagesModule {}
