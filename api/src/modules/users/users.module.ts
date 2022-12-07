import { forwardRef, Module } from '@nestjs/common';

import { DataModule } from '../data';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	controllers: [UsersController],
	imports: [forwardRef(() => DataModule)],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
