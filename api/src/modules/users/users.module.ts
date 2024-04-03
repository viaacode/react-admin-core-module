import { forwardRef, Module } from '@nestjs/common';

import { DataModule } from '../data';
import { AdminOrganisationsModule } from '../organisations';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	controllers: [UsersController],
	imports: [forwardRef(() => DataModule), AdminOrganisationsModule],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
