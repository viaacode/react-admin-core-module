import { MaintenanceAlert } from "./maintenance-alerts.types";

export const ORDER_PROP_TO_DB_PROP: Partial<Record<keyof MaintenanceAlert, string>> = {
	id: 'id',
	icon: 'icon',
	fromDate: 'from_date',
	untilDate: 'until_date',
	active: 'active'
};
