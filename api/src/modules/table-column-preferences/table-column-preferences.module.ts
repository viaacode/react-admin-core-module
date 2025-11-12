import { forwardRef, Module } from '@nestjs/common'

import { DataModule } from '../data'

import { TableColumnPreferencesService } from './services/table-column-preferences.service'
import { TableColumnPreferencesController } from './table-column-preferences.controller'

@Module({
	controllers: [TableColumnPreferencesController],
	imports: [forwardRef(() => DataModule)],
	providers: [TableColumnPreferencesService],
	exports: [TableColumnPreferencesService],
})
export class TableColumnPreferencesModule {}
