import { isNil } from 'lodash';

/**
 * Converts a duration string to milliseconds
 * 00:03:36.045 => 216045
 *
 * @param duration
 * @param silent if this function should throw an error or instead return null if the format of the duration is invalid
 */
export function toMilliseconds(
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
			throw new Error(
				`Kon het tijdsinterval niet analyseren: "${duration}". Verwacht formaat: uu:mm:ss.lll`
			);
		}
		return Math.round(
			(parseInt(durationParts[0], 10) * 3600 +
				parseInt(durationParts[1], 10) * 60 +
				parseFloat(durationParts[2])) *
				1000
		);
	} catch (_err) {
		if (silent) {
			return null;
		}
		throw new Error(
			`Kon het tijdsinterval niet analyseren: "${duration}". Verwacht formaat: uu:mm:ss.lll`
		);
	}
}

/**
 * Converts a formatted duration to whole seconds
 * Used for the media fragment start and end times, which the graph stores as HH:mm:ss.µµµ
 * 00:20:00.400 => 1200
 * 01:02:03.600 => 3724
 * @param duration example: 00:20:00.400, numbers are passed through
 * @returns the number of seconds, or undefined if the value is missing or invalid
 */
export function formattedDurationToSeconds(
	duration: string | number | null | undefined
): number | undefined {
	if (isNil(duration) || duration === '') {
		return undefined;
	}
	if (typeof duration === 'number') {
		return Number.isFinite(duration) ? duration : undefined;
	}
	const match = /^(\d+):([0-5]\d):([0-5]\d(?:\.\d+)?)$/.exec(duration);
	if (!match) {
		return undefined;
	}
	const [, hours, minutes, seconds] = match;
	return Math.round(Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds));
}
