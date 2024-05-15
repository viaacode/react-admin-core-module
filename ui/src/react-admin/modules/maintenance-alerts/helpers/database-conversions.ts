import { MaintenanceAlert } from '../alerts.types';

export const convertFromDatabaseToList = (
	alertList: Record<string, Record<string, string>>
): MaintenanceAlert[] => {
	return alertList.items as unknown as MaintenanceAlert[];
};
