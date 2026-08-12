import { describe, expect, it } from 'vitest';

import { getContrastRatio, WCAG_AA_CONTRAST_NORMAL_TEXT } from './get-contrast-ratio';

describe('getContrastRatio()', () => {
	it('returns the maximum ratio for black on white', () => {
		expect(getContrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
	});

	it('returns 1 for a color against itself', () => {
		expect(getContrastRatio('#9B6072', '#9B6072')).toBeCloseTo(1, 5);
	});

	it('is symmetric, so argument order does not matter', () => {
		expect(getContrastRatio('#9B6072', '#FFFFFF')).toEqual(getContrastRatio('#FFFFFF', '#9B6072'));
	});

	// Reference values from the WebAIM contrast checker.
	it.each([
		['#9B6072', 4.87],
		['#00C8AA', 2.13],
		['#009690', 3.64],
		['#64702B', 5.39],
		['#757575', 4.61],
	])('scores white text on %s at %f:1', (background, expected) => {
		expect(getContrastRatio(background, '#FFFFFF')).toBeCloseTo(expected, 2);
	});

	it('accepts shorthand hex', () => {
		expect(getContrastRatio('#fff', '#FFFFFF')).toBeCloseTo(1, 5);
		expect(getContrastRatio('#000', '#ffffff')).toBeCloseTo(21, 5);
	});

	it('is case insensitive, since the palette mixes casing', () => {
		expect(getContrastRatio('#c6c2e0', '#FFFFFF')).toEqual(getContrastRatio('#C6C2E0', '#FFFFFF'));
	});

	it('works without the leading hash', () => {
		expect(getContrastRatio('000000', 'FFFFFF')).toBeCloseTo(21, 5);
	});

	// The color pickers can hold these, and none of them has a single luminance to compare against.
	it.each([
		['a gradient', 'linear-gradient(to top, #fff 0%, #000 100%)'],
		['the meemoo logo placeholder', '<MEEMOO_LOGO>'],
		['the transparent keyword', 'TRANSPARENT'],
		['a css color name', 'rebeccapurple'],
		['an rgb() value', 'rgb(155, 96, 114)'],
		['a malformed hex', '#12345'],
		['an empty string', ''],
	])('returns null for %s', (_name, color) => {
		expect(getContrastRatio(color, '#FFFFFF')).toBeNull();
	});

	it('exposes the AA threshold for normal text', () => {
		expect(WCAG_AA_CONTRAST_NORMAL_TEXT).toBe(4.5);
	});
});
