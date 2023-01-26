import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { PermissionName } from "@viaa/avo2-types";


import { RequireAnyPermissions } from "../../shared/decorators/require-any-permissions.decorator";
import { addPrefix } from "../../shared/helpers/add-route-prefix";
import { CreateMaintenanceAlertDto } from "../dto/maintenance-alerts.dto";
import { MaintenanceAlert } from "../maintenance-alerts.types";
import { MaintenanceAlertsService } from './../services/maintenance-alerts.service';

@ApiTags('MaintenanceAlerts')
@Controller(addPrefix(process, 'maintenance-alerts'))
export class MaintenanceAlertsController {
	constructor(private maintenanceAlertsService: MaintenanceAlertsService) {}

	@Post()
	@ApiOperation({
		description:
			'Create a new maintenance alert',
	})
	@RequireAnyPermissions(PermissionName.CREATE_MAINTENANCE_ALERTS)
	public async createMaintenanceAlert(
		@Body() createMaintenanceAlertDto: CreateMaintenanceAlertDto,
	): Promise<MaintenanceAlert> {
		return await this.maintenanceAlertsService.createMaintenanceAlert(
			createMaintenanceAlertDto
		)
	}
}
