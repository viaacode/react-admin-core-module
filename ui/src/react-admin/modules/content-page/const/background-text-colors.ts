import { isAvo } from '~shared/helpers/is-avo';
import { Color, type CustomBackground, type GradientColor } from '../types/content-block.types';

/**
 * The WCAG text colors per background color, based on
 * meemoo-hetarchief-kleurencombinaties.pdf (attached to
 * https://meemoo.atlassian.net/browse/ARC-3848) and meemoo's confirmed corrections.
 *
 * Every content block that renders text on an admin-picked background color, and does not offer a
 * text color field of its own, takes its text colors from here.
 *
 * The columns map to `primary` (body text), `secondary` (muted text such as captions, subtitles
 * and metadata) and `hyperlink` (the underlined link color). Differences from the PDF must be
 * documented at the affected row.
 */

export const TEXT_COLOR_WHITE = Color.White;

export interface BackgroundTextColors {
	/** Body text. Always present. */
	primary: Color;
	/** Muted text: captions, subtitles, metadata. Absent when design specified no second color. */
	secondary?: Color;
	/** Underlined link text. Absent when design specified no link color. */
	hyperlink?: Color;
}

/**
 * Only Het Archief colors have a record; the shared Color enum also contains AVO colors.
 */
export const BACKGROUND_TEXT_COLORS: Partial<Record<Color, BackgroundTextColors>> = {
	// Merk
	[Color.Black]: {
		primary: Color.White,
		secondary: Color.Zinc,
		hyperlink: Color.OceanGreen,
	}, // Zwart
	// Meemoo replaced Neutraal #757575 with Leisteen #666666 for muted text on white.
	[Color.White]: { primary: Color.Black, secondary: Color.Slate, hyperlink: Color.Jade }, // Wit
	[Color.OceanGreen]: { primary: Color.Black }, // Teal

	// Functioneel
	[Color.Graphite]: {
		primary: Color.White,
		secondary: Color.Zinc,
		hyperlink: Color.OceanGreen,
	}, // Grafiet
	[Color.Ink]: {
		primary: Color.White,
		secondary: Color.Zinc,
		hyperlink: Color.OceanGreen,
	}, // Inkt
	[Color.Shadow]: { primary: Color.White }, // Schaduw
	[Color.Slate]: { primary: Color.White }, // Leisteen
	[Color.ArchiefNeutral]: { primary: Color.White }, // Neutraal
	// The PDF text originally listed white, but meemoo confirmed the visual is authoritative: black.
	[Color.Zinc]: { primary: Color.Black }, // Zink
	[Color.ArchiefSilver]: {
		primary: Color.Black,
		secondary: Color.Slate,
		hyperlink: Color.Lagoon,
	}, // Zilver
	[Color.Platinum]: {
		primary: Color.Black,
		secondary: Color.Slate,
		hyperlink: Color.Lagoon,
	}, // Platinum
	[Color.Cherry]: { primary: Color.White }, // Kers
	// Jade lists a second color (Zwart) that is not underlined in the PDF, so it reads as secondary
	// rather than a link color. Confirm with design.
	[Color.Jade]: { primary: Color.White, secondary: Color.Black }, // Jade
	[Color.Lagoon]: { primary: Color.White }, // Lagune

	// Secundair
	[Color.SeaGreen]: { primary: Color.Black }, // Zeegroen
	[Color.GrassGreen]: { primary: Color.Black }, // Grasgroen
	[Color.Azure]: { primary: Color.Black }, // Azuur

	// Tertiair
	[Color.Lila]: { primary: Color.Black }, // Lila
	[Color.Mustard]: { primary: Color.Black }, // Mosterd
	[Color.Coral]: { primary: Color.Black }, // Koraal
	// Baby blauw's second color IS underlined in the PDF, so it is the link color, not secondary.
	[Color.BabyBlue]: { primary: Color.Black, hyperlink: Color.Lagoon }, // Baby blauw
	[Color.BlossomPink]: { primary: Color.Black }, // Blush
	[Color.Lavender]: { primary: Color.Black }, // Donker lila
	[Color.Sage]: { primary: Color.Black }, // Mist
	[Color.SandBeige]: { primary: Color.Black }, // Sepia
	[Color.OldPink]: { primary: Color.White }, // Mauve / "oud roze"
	[Color.Pistachio]: { primary: Color.Black }, // Salie
	[Color.Terra]: { primary: Color.Black }, // Terra
	[Color.Olive]: { primary: Color.White }, // Olijf
	[Color.Viola]: { primary: Color.White }, // Viool

	// Selectable legacy color that is not in the PDF. Until meemoo decides whether Sky blauw stays,
	// it uses the confirmed Baby blauw text colors.
	[Color.SkyBlue]: { primary: Color.Black, hyperlink: Color.Lagoon }, // Sky blauw
};

/**
 * The Archief text colors specified for this background color, or undefined on AVO and when the
 * background is not a flat color from the palette (transparent, a gradient or the meemoo logo
 * pattern). Meemoo explicitly confirmed that the BlackWhite gradient must keep each block's
 * existing, separately handled text styling. AVO follows its own brand book, including for hex
 * values shared by both apps.
 */
export function getBackgroundTextColors(
	color: Color | GradientColor | CustomBackground | undefined
): BackgroundTextColors | undefined {
	if (!color || isAvo()) {
		return undefined;
	}

	return BACKGROUND_TEXT_COLORS[color as Color];
}

/**
 * The design text colors for this background as css variables, to spread into a style prop. The
 * u-background-text-* classes read these, so any element inside can say which role its text
 * plays instead of hardcoding a color.
 *
 * Returns an empty object when design specified nothing for this background. The renderer then
 * omits the u-background-text-colors wrapper, leaving the role classes inactive.
 */
export function getBackgroundTextColorVariables(
	color: Color | GradientColor | CustomBackground | undefined
): Record<string, string> {
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
