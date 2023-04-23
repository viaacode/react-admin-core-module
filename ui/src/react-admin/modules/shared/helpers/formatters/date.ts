import { format, formatDistance, parseISO } from 'date-fns';
import nlBE from 'date-fns/locale/nl-BE/index.js';
import { isNumber } from 'lodash-es';

type DateLike = string | Date | number;
type DateLikeNullable = DateLike | undefined | null;

/**
 * Converts a date from format 2000-12-31 to 31/12/2000
 */
export function reorderDate(dateString: string | null, separator = '/'): string {
	return (dateString || '').substring(0, 10).split('-').reverse().join(separator);
}

/**
 * @param timestamp
 */
export function normalizeTimestamp(timestamp: DateLike): Date {
	if (timestamp instanceof Date) {
		return timestamp;
	}
	if (isNumber(timestamp)) {
		return new Date(timestamp);
	}
	return parseISO(timestamp);
}

/**
 * Convert viaa format to relative date
 * @param timestamp
 */
export function fromNow(timestamp: DateLikeNullable): string {
	if (!timestamp) {
		return '';
	}
	return formatDistance(normalizeTimestamp(timestamp), new Date(), {
		addSuffix: true,
		locale: nlBE,
	});
}

/**
 * @param timestamp
 */
export function formatDate(timestamp: DateLikeNullable): string {
	if (!timestamp) {
		return '';
	}
	return format(normalizeTimestamp(timestamp), 'dd-MM-yyyy');
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
	return format(normalizeTimestamp(timestamp), 'yyyy-MM-dd');
}

export function toDateObject(timestamp: DateLikeNullable): Date | null {
	if (!timestamp) {
		return null;
	}
	return normalizeTimestamp(timestamp);
}
