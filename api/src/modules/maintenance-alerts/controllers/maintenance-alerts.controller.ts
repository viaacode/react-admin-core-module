import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { IPagination } from "@studiohyperdrive/pagination";
import { PermissionName } from "@viaa/avo2-types";

import { RequireAnyPermissions } from "../../shared/decorators/require-any-permissions.decorator";
import { SessionUser } from "../../shared/decorators/user.decorator";
import { addPrefix } from "../../shared/helpers/add-route-prefix";
import { SessionUserEntity } from "../../users/classes/session-user";
import { CreateMaintenanceAlertDto, MaintenanceAlertsQueryDto } from "../dto/maintenance-alerts.dto";
import { MaintenanceAlert } from "../maintenance-alerts.types";
import { MaintenanceAlertsService } from './../services/maintenance-alerts.service';

@ApiTags('MaintenanceAlerts')
@Controller(addPrefix(process, 'maintenance-alerts'))
export class MaintenanceAlertsController {
	constructor(private maintenanceAlertsService: MaintenanceAlertsService) {}

	@Get()
	@ApiOperation({
		description:
			'Get maintenance alerts endpoint for meemoo admins and CP admins. Visitors should use the /personal endpoint.',
	})
	@RequireAnyPermissions(PermissionName.VIEW_ANY_MAINTENANCE_ALERTS)
	public async getMaintenanceAlerts(
		@Query() queryDto: MaintenanceAlertsQueryDto,
	): Promise<IPagination<MaintenanceAlert>> {
		return await this.maintenanceAlertsService.findAll(queryDto);
	}

	@Get('personal')
	@ApiOperation({
		description: 'Get maintenance alert for the logged in user.',
	})
	public async getPersonalMaintenanceAlerts(
		@Query() queryDto: MaintenanceAlertsQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<MaintenanceAlert>> {
		return this.maintenanceAlertsService.findAll(queryDto, {
			userGroupIds: user.getGroupIds()
		});
	}

	@Get(':id')
	@RequireAnyPermissions(
		PermissionName.VIEW_ANY_MAINTENANCE_ALERTS,
		PermissionName.VIEW_OWN_MAINTENANCE_ALERTS
	)
	public async getMaintenanceAlertById(
		@Param('id') id: string,
		@SessionUser() user: SessionUserEntity
	): Promise<MaintenanceAlert> {
		return await this.maintenanceAlertsService.findById(id);
	}

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
