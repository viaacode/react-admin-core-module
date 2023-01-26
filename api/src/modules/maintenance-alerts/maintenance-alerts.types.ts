export class MaintenanceAlert {
	id: string;
	title: string;
	message: string;
	icon: string;
	userGroups: string[];
	fromDate: string;
	untilDate: string;
	active: boolean;
}

export type GqlMaintenanceAlert =
	InsertMaintenanceAlertMutation['insert_app_maintenance_alert_one'][0];

export enum MaintenanceAlertOrderProp {
	ID = 'id',
	ICON = 'icon',
	FROM_DATE = 'fromDate',
	UNTIL_DATE = 'untilDate',
	ACTIVE = 'active',
}

