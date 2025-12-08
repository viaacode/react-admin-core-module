import { forwardRef, Module } from '@nestjs/common';

import { DataModule } from '../data';

import { SiteVariablesService } from './services/site-variables.service';

@Module({
	imports: [forwardRef(() => DataModule)],
	providers: [SiteVariablesService],
	exports: [SiteVariablesService],
})
export class SiteVariablesModule {}
