import { Color } from '~modules/content-page/types/content-block.types';

/**
 * Relative luminance of a hex colour, per WCAG 2.1.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
const getRelativeLuminance = (hex: string): number => {
	const normalized = hex.replace('#', '');
	const full =
		normalized.length === 3
			? normalized
					.split('')
					.map((char) => char + char)
					.join('')
			: normalized;

	const toLinear = (channel: string): number => {
		const value = Number.parseInt(channel, 16) / 255;
		return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
	};

	return (
		0.2126 * toLinear(full.slice(0, 2)) +
		0.7152 * toLinear(full.slice(2, 4)) +
		0.0722 * toLinear(full.slice(4, 6))
	);
};

const getContrastRatio = (luminanceA: number, luminanceB: number): number => {
	const lightest = Math.max(luminanceA, luminanceB);
	const darkest = Math.min(luminanceA, luminanceB);
	return (lightest + 0.05) / (darkest + 0.05);
};

/**
 * Black or white, whichever is more readable on the given background.
 *
 * The design fixes the label text to white, but the FA requires that every background colour is
 * allowed, that the default is white, and that the generated labels are "altijd goed
 * gevisualiseerd". Fixed white text fails that for 14 of the 16 allowed colours, white on white
 * worst of all, so the text colour follows the background instead.
 * https://meemoo.atlassian.net/browse/ARC-3818
 */
export const getReadableTextColor = (backgroundColor: string): Color => {
	if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(backgroundColor)) {
		// Not a plain hex colour, fall back to the colour the design specifies
		return Color.White;
	}

	const background = getRelativeLuminance(backgroundColor);
	const onWhite = getContrastRatio(background, getRelativeLuminance(Color.White));
	const onBlack = getContrastRatio(background, getRelativeLuminance(Color.Black));

	return onWhite >= onBlack ? Color.White : Color.Black;
};
