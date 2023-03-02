import {
	FindMaintenanceAlertByIdQuery,
	FindMaintenanceAlertsQuery,
	InsertMaintenanceAlertMutation,
	UpdateMaintenanceAlertMutation,
} from '../shared/generated/graphql-db-types-hetarchief';

export class MaintenanceAlert {
	id: string;
	title: string;
	message: string;
	type: string;
	fromDate: string;
	untilDate: string;
	userGroups?: string[];
}

export type GqlMaintenanceAlert =
	| FindMaintenanceAlertsQuery['app_maintenance_alerts'][0]
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

export enum MaintenanceAlertType {
	INFO = 'info',
	NOTIFICATION = 'notification',
	USER = 'user',
	QUESTION = 'question',
	EXCLAMATION = 'exclamation',
	KEY = 'key',
	CALENDAR = 'calendar',
	BOOK = 'book',
	ANGLE_RIGHT = 'angle-right',
}
