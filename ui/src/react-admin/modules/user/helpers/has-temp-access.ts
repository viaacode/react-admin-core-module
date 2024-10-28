import { endOfDay, isAfter, isBefore, isWithinInterval, parseISO } from 'date-fns';
import type { Avo } from '@viaa/avo2-types';

export function hasTempAccess(tempAccess?: Avo.User.TempAccess): boolean | null {
	if (!tempAccess?.from && !tempAccess?.until) {
		return null;
	}

	let hasAccess: boolean | null;
	const now = new Date();
	if (!tempAccess.from && tempAccess.until) {
		const untilDate = endOfDay(parseISO(tempAccess.until));
		hasAccess = isBefore(now, untilDate);
	} else if (!tempAccess.until && tempAccess.from) {
		const fromDate = parseISO(tempAccess.from);
		hasAccess = isAfter(now, fromDate);
	} else {
		const fromDate = parseISO(tempAccess.from as string);
		const untilDate = endOfDay(parseISO(tempAccess.until as string));
		hasAccess = isWithinInterval(now, { start: fromDate, end: untilDate });
	}

	return hasAccess;
}
