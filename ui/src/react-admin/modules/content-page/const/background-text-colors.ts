import { isAvo } from '~shared/helpers/is-avo';
import { Color, type CustomBackground, type GradientColor } from '../types/content-block.types';

/**
 * The text colors per background color, taken from
 * meemoo-hetarchief-kleurencombinaties-v3.pdf (attached to
 * https://meemoo.atlassian.net/browse/ARC-3848).
 *
 * Every content block that renders text on an admin-picked background color, and does not offer a
 * text color field of its own, takes its text colors from here.
 *
 * The columns map to `primary` ("standaard tekst"), `secondary` ("neutrale tekst": captions,
 * subtitles and metadata) and `hyperlink` ("link/CTA"). Version 3 of the document specifies all
 * three roles for every approved background. A background the document does not list repeats its
 * primary color in the other two roles. Differences from the document must be documented at the row.
 */

export const TEXT_COLOR_WHITE = Color.White;

export interface BackgroundTextColors {
	/** Standard body text. */
	primary: Color;
	/** Neutral text: captions, subtitles, metadata. */
	secondary: Color;
	/** Link and CTA text. */
	hyperlink: Color;
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
	[Color.White]: {
		primary: Color.Black,
		secondary: Color.Slate,
		hyperlink: Color.Jade,
	}, // Wit
	[Color.OceanGreen]: {
		primary: Color.Black,
		secondary: Color.Ink,
		hyperlink: Color.Black,
	}, // Teal

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
	[Color.Shadow]: {
		primary: Color.White,
		secondary: Color.ArchiefSilver,
		hyperlink: Color.White,
	}, // Schaduw
	[Color.Slate]: {
		primary: Color.White,
		secondary: Color.ArchiefSilver,
		hyperlink: Color.White,
	}, // Leisteen
	[Color.ArchiefNeutral]: {
		primary: Color.White,
		secondary: Color.White,
		hyperlink: Color.White,
	}, // Neutraal
	[Color.Zinc]: {
		primary: Color.Black,
		secondary: Color.Ink,
		hyperlink: Color.Black,
	}, // Zink
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
	[Color.Cherry]: {
		primary: Color.White,
		secondary: Color.White,
		hyperlink: Color.White,
	}, // Kers
	// Jade is the one background with two approved sets: all white or all black. A block cannot ask
	// for one of the two, so it takes the white set the document lists first.
	[Color.Jade]: {
		primary: Color.White,
		secondary: Color.White,
		hyperlink: Color.White,
	}, // Jade
	[Color.Lagoon]: {
		primary: Color.White,
		secondary: Color.ArchiefSilver,
		hyperlink: Color.White,
	}, // Lagune

	// Secundair
	[Color.SeaGreen]: {
		primary: Color.Black,
		secondary: Color.Black,
		hyperlink: Color.Black,
	}, // Zeegroen
	[Color.GrassGreen]: {
		primary: Color.Black,
		secondary: Color.Shadow,
		hyperlink: Color.Black,
	}, // Grasgroen
	[Color.Azure]: {
		primary: Color.Black,
		secondary: Color.Graphite,
		hyperlink: Color.Black,
	}, // Azuur

	// Tertiair
	[Color.Lila]: {
		primary: Color.Black,
		secondary: Color.Shadow,
		hyperlink: Color.Black,
	}, // Lila
	[Color.Mustard]: {
		primary: Color.Black,
		secondary: Color.Shadow,
		hyperlink: Color.Black,
	}, // Mosterd
	[Color.Coral]: {
		primary: Color.Black,
		secondary: Color.Ink,
		hyperlink: Color.Black,
	}, // Koraal
	[Color.BabyBlue]: {
		primary: Color.Black,
		secondary: Color.Shadow,
		hyperlink: Color.Lagoon,
	}, // Baby blauw
	[Color.BlossomPink]: {
		primary: Color.Black,
		secondary: Color.Ink,
		hyperlink: Color.Black,
	}, // Blush
	[Color.Lavender]: {
		primary: Color.Black,
		secondary: Color.Ink,
		hyperlink: Color.Black,
	}, // Donker lila
	[Color.Sage]: {
		primary: Color.Black,
		secondary: Color.Ink,
		hyperlink: Color.Black,
	}, // Mist
	[Color.SandBeige]: {
		primary: Color.Black,
		secondary: Color.Shadow,
		hyperlink: Color.Black,
	}, // Sepia
	[Color.OldPink]: {
		primary: Color.White,
		secondary: Color.Platinum,
		hyperlink: Color.White,
	}, // Mauve / "oud roze"
	[Color.Pistachio]: {
		primary: Color.Black,
		secondary: Color.Ink,
		hyperlink: Color.Black,
	}, // Salie

	// Colors that the color-combination document does not list. They keep the primary color the
	// earlier version of the document gave them, and repeat it for the other two roles.
	[Color.Terra]: {
		primary: Color.Black,
		secondary: Color.Black,
		hyperlink: Color.Black,
	}, // Terra
	[Color.Olive]: {
		primary: Color.White,
		secondary: Color.White,
		hyperlink: Color.White,
	}, // Olijf
	[Color.Viola]: {
		primary: Color.White,
		secondary: Color.White,
		hyperlink: Color.White,
	}, // Viool

	// Sky blauw is a selectable legacy color and is not an approved color. Until meemoo decides
	// whether it stays, design asked to give it the Baby blauw text colors.
	[Color.SkyBlue]: {
		primary: Color.Black,
		secondary: Color.Shadow,
		hyperlink: Color.Lagoon,
	}, // Sky blauw
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
		'--bg-text-secondary': textColors.secondary,
		'--bg-text-hyperlink': textColors.hyperlink,
	};
}
