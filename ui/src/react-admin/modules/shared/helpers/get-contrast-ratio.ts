/**
 * WCAG 2.1 contrast ratio between two colors, used to decide readable text colors on
 * admin-picked background colors. https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */

/** WCAG 2.1 AA minimum contrast for normal-sized text (1.4.3). */
export const WCAG_AA_CONTRAST_NORMAL_TEXT = 4.5;

/** WCAG 2.1 AA minimum contrast for large text: >= 24px, or >= 18.66px bold (1.4.3). */
export const WCAG_AA_CONTRAST_LARGE_TEXT = 3;

/**
 * Parses #RGB and #RRGGBB into 0-255 channels. Returns null for anything else, which includes the
 * non-color values the color pickers can hold: Color.Transparent ("TRANSPARENT"),
 * CustomBackground.MeemooLogo ("<MEEMOO_LOGO>") and GradientColor values ("linear-gradient(...)").
 */
function parseHexColor(color: string): [number, number, number] | null {
	const hex = color.trim().replace(/^#/, '');

	if (!/^([\da-f]{3}|[\da-f]{6})$/i.test(hex)) {
		return null;
	}

	const pairs =
		hex.length === 3
			? Array.from(hex, (channel) => channel + channel)
			: (hex.match(/.{2}/g) as string[]);

	return pairs.map((pair) => Number.parseInt(pair, 16)) as [number, number, number];
}

/** Relative luminance per WCAG 2.1. https://www.w3.org/TR/WCAG21/#dfn-relative-luminance */
function getRelativeLuminance([red, green, blue]: [number, number, number]): number {
	const [r, g, b] = [red, green, blue].map((channel) => {
		const srgb = channel / 255;

		return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
	});

	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Contrast ratio between two colors, from 1 (identical) to 21 (black on white).
 * Returns null when either color is not a plain hex color, since a gradient or a pattern has no
 * single luminance to compare against - the caller decides what to do with that.
 */
export function getContrastRatio(colorA: string, colorB: string): number | null {
	const rgbA = parseHexColor(colorA);
	const rgbB = parseHexColor(colorB);

	if (!rgbA || !rgbB) {
		return null;
	}

	const luminanceA = getRelativeLuminance(rgbA);
	const luminanceB = getRelativeLuminance(rgbB);
	const lighter = Math.max(luminanceA, luminanceB);
	const darker = Math.min(luminanceA, luminanceB);

	return (lighter + 0.05) / (darker + 0.05);
}
