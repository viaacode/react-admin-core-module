import { describe, expect, it } from 'vitest';
import { addStartAndEndTimeToUrl } from './add-start-and-end-time-to-url';

describe('addStartAndEndTimeToUrl', () => {
	it('returns the url unchanged when no start or end time is given', () => {
		expect(addStartAndEndTimeToUrl('https://example.com/video.mp4', undefined, undefined)).toEqual(
			'https://example.com/video.mp4'
		);
	});

	it('adds a t query param with both start and end time', () => {
		expect(addStartAndEndTimeToUrl('https://example.com/video.mp4', '10', '20')).toEqual(
			'https://example.com/video.mp4?t=10,20'
		);
	});

	it('adds a t query param with only a start time', () => {
		expect(addStartAndEndTimeToUrl('https://example.com/video.mp4', '10', undefined)).toEqual(
			'https://example.com/video.mp4?t=10,'
		);
	});

	it('adds a t query param with only an end time', () => {
		expect(addStartAndEndTimeToUrl('https://example.com/video.mp4', undefined, '20')).toEqual(
			'https://example.com/video.mp4?t=,20'
		);
	});

	it('appends the t query param to a url that already has query params', () => {
		expect(addStartAndEndTimeToUrl('https://example.com/video.mp4?token=abc', '10', '20')).toEqual(
			'https://example.com/video.mp4?token=abc&t=10,20'
		);
	});
});
