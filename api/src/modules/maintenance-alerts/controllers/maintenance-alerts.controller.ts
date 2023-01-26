import { Body, Controller, Delete, Param, Patch, Post } from "@nestjs/common";
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

	@Patch(':id')
	@ApiOperation({
		description:
			'Update maintenance alert',
	})
	@RequireAnyPermissions(PermissionName.EDIT_MAINTENANCE_ALERTS)
	public async updateMaintenanceAlert(
		@Param('id') maintenanceAlertId: string,
		@Body() updateMaintenanceAlertDto: CreateMaintenanceAlertDto,
	): Promise<MaintenanceAlert> {
		return await this.maintenanceAlertsService.updateMaintenanceAlert(
			maintenanceAlertId,
			updateMaintenanceAlertDto
		)
	}

	@Delete(':id')
	@ApiOperation({
		description:
			'Delete maintenance alert',
	})
	@RequireAnyPermissions(PermissionName.DELETE_MAINTENANCE_ALERTS)
	public async deleteMaintenanceAlert(
		@Param('id') maintenanceAlertId: string
	): Promise<{ status: string }> {
		const affectedRows = await this.maintenanceAlertsService.deleteMaintenanceAlert(
			maintenanceAlertId
		)

		if (affectedRows > 0) {
			return { status: 'Maintenance alert has been deleted' };
		} else {
			return { status: `no maintenance alert found with that id: ${maintenanceAlertId}` };
		}
	}

}
