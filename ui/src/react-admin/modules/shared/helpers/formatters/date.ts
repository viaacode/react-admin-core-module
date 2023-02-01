import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { isNumber } from 'lodash-es';
import moment, { isMoment, Moment, parseZone } from 'moment';

type DateLike = string | Moment | Date | number;
type DateLikeNullable = DateLike | undefined | null;

/**
 * Converts a date from format 2000-12-31 to 31/12/2000
 */
export function reorderDate(dateString: string | null, separator = '/'): string {
	return (dateString || '').substring(0, 10).split('-').reverse().join(separator);
}

/**
 * @deprecated use date-fns functions instead of moment
 * @param timestamp
 */
export function normalizeTimestamp(timestamp: DateLike): Moment {
	if (isMoment(timestamp)) {
		return timestamp;
	}
	if (timestamp instanceof Date || isNumber(timestamp)) {
		return moment(timestamp);
	}
	if (
		timestamp.match(
			/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}[+-][0-9]{2}:[0-9]{2}/g
		)
	) {
		return parseZone(timestamp);
	}
	return moment(timestamp);
}

/**
 * Convert viaa format to relative date
 * @param timestamp
 */
export function fromNow(timestamp: DateLikeNullable): string {
	if (!timestamp) {
		return '';
	}
	return normalizeTimestamp(timestamp).fromNow();
}

/**
 * @deprecated use formatDateString instead (use of the moment library is deprecated)
 * @param timestamp
 */
export function formatDate(timestamp: DateLikeNullable): string {
	if (!timestamp) {
		return '';
	}
	return normalizeTimestamp(timestamp).local().format('DD-MM-YYYY');
}

export function formatDateString(timestamp: string | undefined | null): string {
	if (!timestamp) {
		return '';
	}
	return format(parseISO(timestamp), 'dd-MM-yyyy');
}

export function toIsoDate(timestamp: DateLikeNullable): string {
	if (!timestamp) {
		return '';
	}
	return normalizeTimestamp(timestamp).format('YYYY-MM-DD');
}

export function toDateObject(timestamp: DateLikeNullable): Date | null {
	if (!timestamp) {
		return null;
	}
	return normalizeTimestamp(timestamp).toDate();
}
