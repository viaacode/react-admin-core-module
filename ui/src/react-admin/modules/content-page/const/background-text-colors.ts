/**
 * The WCAG text colors per background color, exactly as delivered by design in
 * meemoo-hetarchief-kleurencombinaties.pdf (attached to
 * https://meemoo.atlassian.net/browse/ARC-3848).
 *
 * Every content block that renders text on an admin-picked background color, and does not offer a
 * text color field of its own, takes its text colors from here.
 *
 * The PDF is the authority: do not derive these values, and do not "fix" a row that looks off -
 * raise it with design instead. The columns map to `primary` (body text), `secondary` (muted text
 * such as captions, subtitles and metadata) and `hyperlink` (the underlined link color).
 */

/** Named colors from the PDF, so the rows below read like the design document. */
const WIT = '#FFFFFF';
const ZWART = '#000000';
const ZINK = '#ADADAD';
const TEAL = '#00C8AA';
const NEUTRAAL = '#757575';
const JADE = '#00857D';
const LEISTEEN = '#666666';
const LAGUNE = '#005F69';

/**
 * White as the PDF writes it. Color.White is the shorthand '#FFF', so compare against this when
 * checking whether a background got light text.
 */
export const TEXT_COLOR_WHITE = WIT;

export interface BackgroundTextColors {
	/** Body text. Always present. */
	primary: string;
	/** Muted text: captions, subtitles, metadata. Absent when design specified no second color. */
	secondary?: string;
	/** Underlined link text. Absent when design specified no link color. */
	hyperlink?: string;
}

/**
 * Keyed by background color, normalised to lowercase 6-digit hex - the Color enum mixes casing and
 * shorthand (Color.Black is '#000', Color.Lila is '#c6c2e0'), so always look up through
 * getBackgroundTextColors rather than indexing this directly.
 */
export const BACKGROUND_TEXT_COLORS: Record<string, BackgroundTextColors> = {
	// Merk
	'#000000': { primary: WIT, secondary: ZINK, hyperlink: TEAL }, // Zwart
	'#ffffff': { primary: ZWART, secondary: NEUTRAAL, hyperlink: JADE }, // Wit
	'#00c8aa': { primary: ZWART }, // Teal

	// Functioneel
	'#222222': { primary: WIT, secondary: ZINK, hyperlink: TEAL }, // Grafiet
	'#303030': { primary: WIT, secondary: ZINK, hyperlink: TEAL }, // Inkt
	'#505050': { primary: WIT }, // Schaduw
	'#666666': { primary: WIT }, // Leisteen
	'#757575': { primary: WIT }, // Neutraal
	'#adadad': { primary: WIT }, // Zink - see the open question in the ticket, white is 2.24:1 here
	'#e6e6e6': { primary: ZWART, secondary: LEISTEEN, hyperlink: LAGUNE }, // Zilver
	'#f8f8f8': { primary: ZWART, secondary: LEISTEEN, hyperlink: LAGUNE }, // Platinum
	'#d60039': { primary: WIT }, // Kers
	// Jade lists a second color (Zwart) that is not underlined in the PDF, so it reads as secondary
	// rather than a link color. Confirm with design.
	'#00857d': { primary: WIT, secondary: ZWART }, // Jade
	'#005f69': { primary: WIT }, // Lagune

	// Secundair
	'#009690': { primary: ZWART }, // Zeegroen
	'#82e678': { primary: ZWART }, // Grasgroen
	'#28a0c8': { primary: ZWART }, // Azuur

	// Tertiair
	'#c6c2e0': { primary: ZWART }, // Lila
	'#efca6a': { primary: ZWART }, // Mosterd
	'#e89b88': { primary: ZWART }, // Koraal
	// Baby blauw's second color IS underlined in the PDF, so it is the link color, not secondary.
	'#8ddee7': { primary: ZWART, hyperlink: LAGUNE }, // Baby blauw
	'#e694b3': { primary: ZWART }, // Blush
	'#a293af': { primary: ZWART }, // Donker lila
	'#91a9a7': { primary: ZWART }, // Mist
	'#edd6c4': { primary: ZWART }, // Sepia
	'#9b6072': { primary: WIT }, // Mauve / "oud roze"
	'#b8be9a': { primary: ZWART }, // Salie
	'#d1543a': { primary: ZWART }, // Terra
	'#64702b': { primary: WIT }, // Olijf
	'#432457': { primary: WIT }, // Viool
};

/**
 * Normalises a background color to the key format used above: lowercase 6-digit hex.
 * Returns null for anything that is not a plain hex color, which includes Color.Transparent
 * ('TRANSPARENT'), CustomBackground.MeemooLogo ('<MEEMOO_LOGO>') and the GradientColor values.
 */
function normaliseHex(color: string): string | null {
	const hex = color.trim().toLowerCase().replace(/^#/, '');

	if (!/^([\da-f]{3}|[\da-f]{6})$/.test(hex)) {
		return null;
	}

	const expanded =
		hex.length === 3 ? Array.from(hex, (channel) => channel + channel).join('') : hex;

	return `#${expanded}`;
}

/**
 * The WCAG text colors design specified for this background color, or undefined when the background
 * is not a flat color from the palette (transparent, a gradient, the meemoo logo pattern) or is an
 * AVO-only color, which follows its own brand book.
 */
export function getBackgroundTextColors(
	color: string | undefined
): BackgroundTextColors | undefined {
	if (!color) {
		return undefined;
	}

	const key = normaliseHex(color);

	return key ? BACKGROUND_TEXT_COLORS[key] : undefined;
}

/**
 * The design text colors for this background as css variables, to spread into a style prop. The
 * u-text-primary / u-text-secondary / u-text-hyperlink classes read these, so any element inside
 * can say which role its text plays instead of hardcoding a color.
 *
 * Returns an empty object when design specified nothing for this background, which leaves the
 * variables unset and the utility classes falling back to `inherit`.
 */
export function getBackgroundTextColorVariables(color: string | undefined): Record<string, string> {
	const textColors = getBackgroundTextColors(color);

	if (!textColors) {
		return {};
	}

	return {
		'--bg-text-primary': textColors.primary,
		...(textColors.secondary ? { '--bg-text-secondary': textColors.secondary } : {}),
		...(textColors.hyperlink ? { '--bg-text-hyperlink': textColors.hyperlink } : {}),
	};
}
