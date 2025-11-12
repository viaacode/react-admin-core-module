import { Module } from '@nestjs/common'

import { DataModule } from '../data'

import { MaintenanceAlertsController } from './controllers/maintenance-alerts.controller'
import { MaintenanceAlertsService } from './services/maintenance-alerts.service'

@Module({
	controllers: [MaintenanceAlertsController],
	providers: [MaintenanceAlertsService],
	imports: [DataModule],
	exports: [MaintenanceAlertsService],
})
export class MaintenanceAlertsModule {}
