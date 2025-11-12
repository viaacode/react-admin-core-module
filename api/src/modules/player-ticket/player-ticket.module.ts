import { CacheModule } from '@nestjs/cache-manager'
import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { DataModule } from '../data'

import { PlayerTicketController } from './player-ticket.controller'
import { PlayerTicketService } from './services/player-ticket.service'

@Module({
	controllers: [PlayerTicketController],
	imports: [forwardRef(() => DataModule), ConfigModule, CacheModule.register()],
	providers: [PlayerTicketService, PlayerTicketController],
	exports: [PlayerTicketService, PlayerTicketController],
})
export class PlayerTicketModule {}
