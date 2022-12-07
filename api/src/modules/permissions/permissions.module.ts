import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PermissionsController } from './controllers/permissions.controller';
import { PermissionsService } from './services/permissions.service';

import { DataModule } from '../data';

@Module({
	imports: [forwardRef(() => DataModule), ConfigModule],
	controllers: [PermissionsController],
	providers: [PermissionsService],
})
export class AdminPermissionsModule {}
