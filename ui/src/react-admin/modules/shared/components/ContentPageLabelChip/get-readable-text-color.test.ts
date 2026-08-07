import { describe, expect, it, vi } from 'vitest';

import { GET_CONTENT_PAGE_LABEL_COLOR_OPTIONS } from '~modules/content-page/const/get-color-options';
import { Color } from '~modules/content-page/types/content-block.types';
import { getReadableTextColor } from './get-readable-text-color';

// The colour options are labelled with tText, which needs an initialised AdminConfigManager
vi.mock('~shared/helpers/translation-functions', () => ({
	tText: (key: string) => key,
	tHtml: (key: string) => key,
}));

const relativeLuminance = (hex: string): number => {
	const normalized = hex.replace('#', '');
	const full =
		normalized.length === 3
			? normalized
					.split('')
					.map((c) => c + c)
					.join('')
			: normalized;
	const toLinear = (channel: string) => {
		const v = Number.parseInt(channel, 16) / 255;
		return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
	};
	return (
		0.2126 * toLinear(full.slice(0, 2)) +
		0.7152 * toLinear(full.slice(2, 4)) +
		0.0722 * toLinear(full.slice(4, 6))
	);
};

const contrast = (a: string, b: string) => {
	const [la, lb] = [relativeLuminance(a), relativeLuminance(b)];
	return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

describe('getReadableTextColor', () => {
	it('uses black on light backgrounds', () => {
		expect(getReadableTextColor(Color.White)).toEqual(Color.Black);
		expect(getReadableTextColor('#EDD6C4')).toEqual(Color.Black); // Zandbeige
		expect(getReadableTextColor('#EFCA6A')).toEqual(Color.Black); // Honinggeel
	});

	it('uses white on dark backgrounds', () => {
		expect(getReadableTextColor(Color.Black)).toEqual(Color.White);
		expect(getReadableTextColor('#9B6072')).toEqual(Color.White); // Oudroze
	});

	it('handles both the 3 and 6 digit hex forms', () => {
		expect(getReadableTextColor('#FFF')).toEqual(getReadableTextColor('#FFFFFF'));
	});

	it('falls back to white for anything that is not a plain hex colour', () => {
		expect(getReadableTextColor(Color.Transparent)).toEqual(Color.White);
		expect(getReadableTextColor('')).toEqual(Color.White);
	});

	// The FA requires that every allowed colour yields a label that is "altijd goed gevisualiseerd"
	it('meets WCAG AA on every colour the label picker offers', () => {
		const failures = GET_CONTENT_PAGE_LABEL_COLOR_OPTIONS()
			.map((option) => {
				const background = option.value as string;
				const ratio = contrast(background, getReadableTextColor(background));
				return { label: option.label, background, ratio };
			})
			.filter(({ ratio }) => ratio < 4.5);

		expect(failures).toEqual([]);
	});
});
