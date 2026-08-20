/**
 * Converts a duration in the form: 00:00:00 to number of seconds
 * @param duration
 */

import { CustomError } from '../custom-error';

export function parseDuration(duration: string) {
	const parts = duration.split(':');
	return (
		Number.parseInt(parts[0], 10) * 3600 +
		Number.parseInt(parts[1], 10) * 60 +
		Number.parseInt(parts[2], 10)
	);
}

/**
 * Converts seconds or a duration string to seconds
 * 00:03:36 => 216
 *
 * @param duration
 * @param silent if this function should throw an error or instead return null if the format of the duration is invalid
 */
export function toSeconds(
	duration: number | string | undefined | null,
	silent = false
): number | null {
	if (!duration) {
		return 0;
	}
	if (typeof duration === 'number') {
		return duration;
	}

	const durationParts = duration.split(':');
	try {
		if (durationParts.length !== 3) {
			throw new CustomError(
				`Kon het tijdsinterval niet analyseren: "${duration}". Verwacht formaat: uu:mm:ss`
			);
		}
		return (
			Number.parseInt(durationParts[0], 10) * 3600 +
			Number.parseInt(durationParts[1], 10) * 60 +
			Number.parseFloat(durationParts[2])
		);
	} catch (err) {
		if (silent) {
			return null;
		}
		throw new CustomError(
			`Kon het tijdsinterval niet analyseren: "${duration}". Verwacht formaat: uu:mm:ss`,
			err,
			{ duration }
		);
	}
}

/**
 * Matches a snippet time as the admin enters it: `MM:SS` or `HH:MM:SS`.
 * Hours are unbounded (a recording can be longer than a day); minutes and seconds are 00-59.
 */
const SNIPPET_TIME_REGEX = /^(?:(\d+):)?([0-5]?\d):([0-5]\d)$/;

/**
 * Converts a snippet time entered by an admin to whole seconds.
 * Accepts `HH:MM:SS` and `MM:SS` (the hours part may be omitted).
 * Returns null when the value is empty or not a valid time, so callers can distinguish
 * "not filled in" from "0 seconds" — `00:00:00` is a legitimate start time.
 *
 * https://meemoo.atlassian.net/browse/ARC-3832
 */
export function snippetTimeToSeconds(time: string | undefined | null): number | null {
	const match = SNIPPET_TIME_REGEX.exec((time || '').trim());

	if (!match) {
		return null;
	}
	const [, hours, minutes, seconds] = match;

	return (
		Number.parseInt(hours || '0', 10) * 3600 +
		Number.parseInt(minutes, 10) * 60 +
		Number.parseInt(seconds, 10)
	);
}
