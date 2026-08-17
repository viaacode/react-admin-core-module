import { format, formatDistance, isValid, parseISO } from 'date-fns';
import { enGB, nlBE } from 'date-fns/locale';
import { Locale } from '~modules/translations/translations.core.types';

type DateLike = string | Date | number;
type DateLikeNullable = DateLike | undefined | null;

const DATE_FNS_LOCALES = { [Locale.Nl]: nlBE, [Locale.En]: enGB };

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
	if (typeof timestamp === 'number') {
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

/**
 * Force date to be interpreted as a GMT time without timezone from the database => parse it as a Europe/Brussels time in the date object
 * @param timestamp
 */
export function parseAsIsoWithoutTimezone(timestamp: string): Date {
	if (!timestamp.endsWith('Z')) {
		return parseISO(`${timestamp}Z`);
	} else {
		return parseISO(timestamp);
	}
}

/**
 * Formats a date string from YYYY-MM-DD to 'dd MMM. yyyy' format in Dutch (Belgium) locale.
 * For example, '2020-09-15' becomes '15 sep. 2020'.
 *
 * @param dateString The date string in YYYY-MM-DD format.
 * @returns The formatted date string.
 */
export function formatDateToDayMonthYear(dateString: string | undefined | null): string {
	if (!dateString) {
		return '';
	}
	return format(parseISO(dateString), 'd MMM. yyyy', { locale: nlBE });
}

/**
 * Formats a date with its month written out in full, in the given locale.
 * For example, '2020-09-15' becomes '15 september 2020' (nl) or '15 September 2020' (en).
 * Returns an empty string for missing or unparsable dates.
 *
 * @param timestamp The date to format.
 * @param locale The locale to write the month name in. Defaults to Dutch.
 */
export function formatDateToDayMonthNameYear(
	timestamp: DateLikeNullable,
	locale: Locale = Locale.Nl
): string {
	if (!timestamp) {
		return '';
	}
	const date = normalizeTimestamp(timestamp);
	if (!isValid(date)) {
		return '';
	}
	return format(date, 'd MMMM yyyy', { locale: DATE_FNS_LOCALES[locale] });
}

/**
 * Returns the year of a date, or null when the date is missing or unparsable.
 */
export function getYear(timestamp: DateLikeNullable): number | null {
	if (!timestamp) {
		return null;
	}
	const date = normalizeTimestamp(timestamp);
	return isValid(date) ? date.getFullYear() : null;
}
