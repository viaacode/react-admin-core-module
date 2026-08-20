import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Color, CustomBackground, GradientColor } from '../types/content-block.types';
import {
	BACKGROUND_TEXT_COLORS,
	getBackgroundTextColors,
	getBackgroundTextColorVariables,
} from './background-text-colors';
import { GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF, hasDarkBackground } from './get-color-options';

const isAvoMock = vi.hoisted(() => vi.fn<() => boolean>());

vi.mock('~shared/helpers/is-avo', () => ({ isAvo: isAvoMock }));
vi.mock('~shared/helpers/translation-functions', () => ({ tText: (key: string) => key }));

/**
 * Every supported Archief background as [name, background, primary, secondary, hyperlink], based
 * on meemoo-hetarchief-kleurencombinaties-v3.pdf and the corrections confirmed by meemoo on
 * ARC-3848. Version 3 specifies all three roles for every approved background. Sky blauw, Terra,
 * Olijf and Viool are absent from the document.
 */
const EXPECTED_BACKGROUND_TEXT_COLORS: [string, Color, Color, Color?, Color?][] = [
	// Merk
	['Zwart', Color.Black, Color.White, Color.Zinc, Color.OceanGreen],
	['Wit', Color.White, Color.Black, Color.Slate, Color.Jade],
	['Teal', Color.OceanGreen, Color.Black, Color.Ink, Color.Black],
	// Functioneel
	['Grafiet', Color.Graphite, Color.White, Color.Zinc, Color.OceanGreen],
	['Inkt', Color.Ink, Color.White, Color.Zinc, Color.OceanGreen],
	['Schaduw', Color.Shadow, Color.White, Color.ArchiefSilver, Color.White],
	['Leisteen', Color.Slate, Color.White, Color.ArchiefSilver, Color.White],
	['Neutraal', Color.ArchiefNeutral, Color.White, Color.White, Color.White],
	['Zink', Color.Zinc, Color.Black, Color.Ink, Color.Black],
	['Zilver', Color.ArchiefSilver, Color.Black, Color.Slate, Color.Lagoon],
	['Platinum', Color.Platinum, Color.Black, Color.Slate, Color.Lagoon],
	['Kers', Color.Cherry, Color.White, Color.White, Color.White],
	['Jade', Color.Jade, Color.White, Color.White, Color.White],
	['Lagune', Color.Lagoon, Color.White, Color.ArchiefSilver, Color.White],
	// Secundair
	['Zeegroen', Color.SeaGreen, Color.Black, Color.Black, Color.Black],
	['Grasgroen', Color.GrassGreen, Color.Black, Color.Shadow, Color.Black],
	['Azuur', Color.Azure, Color.Black, Color.Graphite, Color.Black],
	// Tertiair
	['Lila', Color.Lila, Color.Black, Color.Shadow, Color.Black],
	['Mosterd', Color.Mustard, Color.Black, Color.Shadow, Color.Black],
	['Koraal', Color.Coral, Color.Black, Color.Ink, Color.Black],
	['Baby blauw', Color.BabyBlue, Color.Black, Color.Shadow, Color.Lagoon],
	['Blush', Color.BlossomPink, Color.Black, Color.Ink, Color.Black],
	['Donker lila', Color.Lavender, Color.Black, Color.Ink, Color.Black],
	['Mist', Color.Sage, Color.Black, Color.Ink, Color.Black],
	['Sepia', Color.SandBeige, Color.Black, Color.Shadow, Color.Black],
	['Mauve', Color.OldPink, Color.White, Color.Platinum, Color.White],
	['Salie', Color.Pistachio, Color.Black, Color.Ink, Color.Black],
	// Not in the document; only a primary color, so the other roles fall back to it.
	['Terra', Color.Terra, Color.Black],
	['Olijf', Color.Olive, Color.White],
	['Viool', Color.Viola, Color.White],
	// Not in the document; temporarily follows Baby blauw while meemoo decides whether it remains.
	['Sky blauw', Color.SkyBlue, Color.Black, Color.Shadow, Color.Lagoon],
];

describe('getBackgroundTextColors()', () => {
	beforeEach(() => {
		isAvoMock.mockReturnValue(false);
	});

	it.each(EXPECTED_BACKGROUND_TEXT_COLORS)(
		'matches the design for %s',
		(_name, background, primary, secondary, hyperlink) => {
			expect(getBackgroundTextColors(background)).toEqual({
				primary,
				...(secondary ? { secondary } : {}),
				...(hyperlink ? { hyperlink } : {}),
			});
		}
	);

	it('holds every approved row and the temporary Sky blauw fallback, with no extras', () => {
		expect(Object.keys(BACKGROUND_TEXT_COLORS)).toHaveLength(
			EXPECTED_BACKGROUND_TEXT_COLORS.length
		);
	});

	it('looks up the Color enum values directly', () => {
		expect(getBackgroundTextColors(Color.Black)?.primary).toBe(Color.White);
		expect(getBackgroundTextColors(Color.White)?.primary).toBe(Color.Black);
		expect(getBackgroundTextColors(Color.Lila)?.primary).toBe(Color.Black);
		expect(getBackgroundTextColors(Color.OldPink)?.primary).toBe(Color.White);
		expect(getBackgroundTextColors(Color.BabyBlue)?.hyperlink).toBe(Color.Lagoon);
		expect(getBackgroundTextColors(Color.SkyBlue)).toEqual(getBackgroundTextColors(Color.BabyBlue));
	});

	it('has a ruling for every selectable flat Archief background', () => {
		const backgroundsWithoutOneTextColor = [
			Color.Transparent,
			GradientColor.BlackWhite,
			CustomBackground.MeemooLogo,
		];
		const flatBackgrounds = GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF()
			.map((option) => option.value)
			.filter((value) => !backgroundsWithoutOneTextColor.includes(value));

		for (const background of flatBackgrounds) {
			expect(
				getBackgroundTextColors(background),
				`missing text colors for ${background}`
			).toBeDefined();
		}
	});

	// Design specified nothing for these, so blocks keep whatever they inherit. In particular,
	// meemoo confirmed that BlackWhite must retain the existing per-block handling.
	it.each<[string, Color | GradientColor | CustomBackground | undefined]>([
		['transparent', Color.Transparent],
		['the separately handled black-white gradient', GradientColor.BlackWhite],
		['the meemoo logo pattern', CustomBackground.MeemooLogo],
		['an AVO-only color', Color.SoftBlue],
		['no background', undefined],
	])('has no colors for %s', (_name, background) => {
		expect(getBackgroundTextColors(background)).toBeUndefined();
	});

	describe('on AVO', () => {
		beforeEach(() => {
			isAvoMock.mockReturnValue(true);
		});

		it('does not apply an Archief record to a shared hex color', () => {
			expect(getBackgroundTextColors(Color.OceanGreen)).toBeUndefined();
			expect(getBackgroundTextColorVariables(Color.OceanGreen)).toEqual({});
		});

		it('keeps the existing AVO dark-background ruling', () => {
			expect(hasDarkBackground(Color.OceanGreen)).toBe(true);
		});
	});
});

describe('getBackgroundTextColorVariables()', () => {
	beforeEach(() => {
		isAvoMock.mockReturnValue(false);
	});
	it('exposes all three roles when design specified all three', () => {
		expect(getBackgroundTextColorVariables(Color.Black)).toEqual({
			'--bg-text-primary': Color.White,
			'--bg-text-secondary': Color.Zinc,
			'--bg-text-hyperlink': Color.OceanGreen,
		});
	});

	// Leaving them unset is what makes the utility classes fall back to the primary color.
	it('omits the roles design did not specify', () => {
		expect(getBackgroundTextColorVariables(Color.Terra)).toEqual({
			'--bg-text-primary': Color.Black,
		});
	});

	it('returns nothing for a background design specified no colors for', () => {
		expect(getBackgroundTextColorVariables(GradientColor.BlackWhite)).toEqual({});
	});
});
