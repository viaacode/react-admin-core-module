import { forwardRef, Module } from '@nestjs/common';

import { DataModule } from '../data';
import { LookupController } from './lookup.controller';
import { LookupService } from './lookup.service';

@Module({
	controllers: [LookupController],
	imports: [forwardRef(() => DataModule)],
	providers: [LookupService],
	exports: [LookupService],
})
export class LookupModule {}
