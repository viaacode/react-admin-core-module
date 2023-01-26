import { Logger } from "@nestjs/common";

import { DataService } from "../../data";
import { CreateMaintenanceAlertDto } from './../dto/maintenance-alerts.dto';
import { GqlMaintenanceAlert, MaintenanceAlert } from "../maintenance-alerts.types";

export class MaintenanceAlertsService {
	private logger: Logger = new Logger(MaintenanceAlertsService.name, { timestamp: true });

	constructor(protected dataService: DataService) {}

	public adapt(graphqlMaintenanceAlert: GqlMaintenanceAlert): MaintenanceAlert | null {
		if (!graphqlMaintenanceAlert) {
			return null;
		}

		return {
			id: graphqlMaintenanceAlert.id,
			title: graphqlMaintenanceAlert.title,
			message: graphqlMaintenanceAlert.message,
			icon: graphqlMaintenanceAlert.icon,
			userGroups: graphqlMaintenanceAlert.user_groups,
			fromDate: graphqlMaintenanceAlert.from_date,
			untilDate: graphqlMaintenanceAlert.until_date,
			active: graphqlMaintenanceAlert.active
		}
	}

	public async createMaintenanceAlert(
		createMaintenanceAlertDto: CreateMaintenanceAlertDto
	): Promise<MaintenanceAlert> {
		const newMaintenanceAlert = {
			title: createMaintenanceAlertDto.title,
			message: createMaintenanceAlertDto.message,
			icon: createMaintenanceAlertDto.icon,
			user_groups: createMaintenanceAlertDto.userGroups,
			from_date: createMaintenanceAlertDto.fromDate,
			until_date: createMaintenanceAlertDto.untilDate,
			active: createMaintenanceAlertDto.active
		};

		const { insert_app_maintenance_alerts_one: createdMainteanceAlert } =
			await this.dataService.execute<
				InsertMaintenanceAlertMutation,
				InsertMaintenanceAlertMutationVariables
			>(InsertMaintenanceAlertDocument, {
				newMaintenanceAlert
			});

		this.logger.debug(`Maintenance alert ${createdMainteanceAlert.id} created.`);

		return this.adapt(createdMainteanceAlert);
	}
}
