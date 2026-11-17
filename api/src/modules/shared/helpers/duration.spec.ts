import { formattedDurationToSeconds } from './duration';

describe('formattedDurationToSeconds', () => {
	it('converts the graph time format to whole seconds', () => {
		expect(formattedDurationToSeconds('00:20:00.400')).toEqual(1200);
		expect(formattedDurationToSeconds('01:02:03.600')).toEqual(3724);
		expect(formattedDurationToSeconds('00:00:10')).toEqual(10);
	});

	it('passes numbers through', () => {
		expect(formattedDurationToSeconds(42)).toEqual(42);
	});

	it('returns undefined for missing or invalid values', () => {
		expect(formattedDurationToSeconds(null)).toBeUndefined();
		expect(formattedDurationToSeconds(undefined)).toBeUndefined();
		expect(formattedDurationToSeconds('')).toBeUndefined();
		expect(formattedDurationToSeconds('invalid')).toBeUndefined();
		expect(formattedDurationToSeconds(Number.NaN)).toBeUndefined();
	});
});
