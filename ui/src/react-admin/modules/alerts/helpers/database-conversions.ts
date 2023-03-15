import { Alert } from '../alerts.types';

export const convertFromDatabaseToList = (
	alertList: Record<string, Record<string, string>>
): Alert[] => {
	return alertList.items as unknown as Alert[];
};
