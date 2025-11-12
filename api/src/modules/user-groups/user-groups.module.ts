import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { DataModule } from '../data'

import { UserGroupsController } from './controllers/user-groups.controller'
import { UserGroupsService } from './services/user-groups.service'

@Module({
	imports: [forwardRef(() => DataModule), ConfigModule],
	controllers: [UserGroupsController],
	providers: [UserGroupsService],
})
export class AdminUserGroupsModule {}
