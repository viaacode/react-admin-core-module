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
 * on meemoo-hetarchief-kleurencombinaties.pdf and the corrections confirmed by meemoo on
 * ARC-3848. Sky blauw is the only selectable legacy color that is absent from the PDF.
 */
const EXPECTED_BACKGROUND_TEXT_COLORS: [string, Color, Color, Color?, Color?][] = [
	// Merk
	['Zwart', Color.Black, Color.White, Color.Zinc, Color.OceanGreen],
	['Wit', Color.White, Color.Black, Color.Slate, Color.Jade],
	['Teal', Color.OceanGreen, Color.Black],
	// Functioneel
	['Grafiet', Color.Graphite, Color.White, Color.Zinc, Color.OceanGreen],
	['Inkt', Color.Ink, Color.White, Color.Zinc, Color.OceanGreen],
	['Schaduw', Color.Shadow, Color.White],
	['Leisteen', Color.Slate, Color.White],
	['Neutraal', Color.ArchiefNeutral, Color.White],
	['Zink', Color.Zinc, Color.Black],
	['Zilver', Color.ArchiefSilver, Color.Black, Color.Slate, Color.Lagoon],
	['Platinum', Color.Platinum, Color.Black, Color.Slate, Color.Lagoon],
	['Kers', Color.Cherry, Color.White],
	['Jade', Color.Jade, Color.White, Color.Black],
	['Lagune', Color.Lagoon, Color.White],
	// Secundair
	['Zeegroen', Color.SeaGreen, Color.Black],
	['Grasgroen', Color.GrassGreen, Color.Black],
	['Azuur', Color.Azure, Color.Black],
	// Tertiair
	['Lila', Color.Lila, Color.Black],
	['Mosterd', Color.Mustard, Color.Black],
	['Koraal', Color.Coral, Color.Black],
	['Baby blauw', Color.BabyBlue, Color.Black, undefined, Color.Lagoon],
	['Blush', Color.BlossomPink, Color.Black],
	['Donker lila', Color.Lavender, Color.Black],
	['Mist', Color.Sage, Color.Black],
	['Sepia', Color.SandBeige, Color.Black],
	['Mauve', Color.OldPink, Color.White],
	['Salie', Color.Pistachio, Color.Black],
	['Terra', Color.Terra, Color.Black],
	['Olijf', Color.Olive, Color.White],
	['Viool', Color.Viola, Color.White],
	// Not in the PDF; temporarily follows Baby blauw while meemoo decides whether it remains.
	['Sky blauw', Color.SkyBlue, Color.Black, undefined, Color.Lagoon],
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
		expect(getBackgroundTextColorVariables(Color.OldPink)).toEqual({
			'--bg-text-primary': Color.White,
		});
	});

	it('returns nothing for a background design specified no colors for', () => {
		expect(getBackgroundTextColorVariables(GradientColor.BlackWhite)).toEqual({});
	});
});
