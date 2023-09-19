import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlayerTicketController } from './player-ticket.controller';
import { CacheModule } from '@nestjs/cache-manager';

import { PlayerTicketService } from './services/player-ticket.service';

import { DataModule } from '../data';

@Module({
	controllers: [PlayerTicketController],
	imports: [forwardRef(() => DataModule), ConfigModule, CacheModule.register()],
	providers: [PlayerTicketService, PlayerTicketController],
	exports: [PlayerTicketService, PlayerTicketController],
})
export class PlayerTicketModule {}
