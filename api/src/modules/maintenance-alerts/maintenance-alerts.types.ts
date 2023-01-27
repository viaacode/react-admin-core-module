import { FindMaintenanceAlertByIdQuery, UpdateMaintenanceAlertMutation } from './../shared/generated/graphql-db-types-hetarchief';
import { FindMaintenanceAlertsQuery, InsertMaintenanceAlertMutation } from "../shared/generated/graphql-db-types-hetarchief";

export class MaintenanceAlert {
	id: string;
	title: string;
	message: string;
	type: string;
	userGroups: string[];
	fromDate: string;
	untilDate: string;
}

export type GqlMaintenanceAlert =
	FindMaintenanceAlertsQuery['app_maintenance_alerts'][0]
	| FindMaintenanceAlertByIdQuery['app_maintenance_alerts'][0]
	| UpdateMaintenanceAlertMutation['update_app_maintenance_alerts']['returning'][0]
	| InsertMaintenanceAlertMutation['insert_app_maintenance_alerts_one'];

export enum MaintenanceAlertOrderProp {
	ID = 'id',
	ICON = 'icon',
	FROM_DATE = 'fromDate',
	UNTIL_DATE = 'untilDate',
	ACTIVE = 'active',
}

