import { forwardRef, Module } from '@nestjs/common';

import { SiteVariablesService } from './services/site-variables.service';

import { DataModule } from '../data/data.module';

@Module({
	imports: [forwardRef(() => DataModule)],
	providers: [SiteVariablesService],
	exports: [SiteVariablesService],
})
export class SiteVariablesModule {}
