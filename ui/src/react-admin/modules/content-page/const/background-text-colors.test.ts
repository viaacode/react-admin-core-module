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
const EXPECTED_BACKGROUND_TEXT_COLORS: [string, string, string, string?, string?][] = [
	// Merk
	['Zwart', '#000000', '#FFFFFF', '#ADADAD', '#00C8AA'],
	['Wit', '#FFFFFF', '#000000', '#666666', '#00857D'],
	['Teal', '#00C8AA', '#000000'],
	// Functioneel
	['Grafiet', '#222222', '#FFFFFF', '#ADADAD', '#00C8AA'],
	['Inkt', '#303030', '#FFFFFF', '#ADADAD', '#00C8AA'],
	['Schaduw', '#505050', '#FFFFFF'],
	['Leisteen', '#666666', '#FFFFFF'],
	['Neutraal', '#757575', '#FFFFFF'],
	['Zink', '#ADADAD', '#000000'],
	['Zilver', '#E6E6E6', '#000000', '#666666', '#005F69'],
	['Platinum', '#F8F8F8', '#000000', '#666666', '#005F69'],
	['Kers', '#D60039', '#FFFFFF'],
	['Jade', '#00857D', '#FFFFFF', '#000000'],
	['Lagune', '#005F69', '#FFFFFF'],
	// Secundair
	['Zeegroen', '#009690', '#000000'],
	['Grasgroen', '#82E678', '#000000'],
	['Azuur', '#28A0C8', '#000000'],
	// Tertiair
	['Lila', '#C6C2E0', '#000000'],
	['Mosterd', '#EFCA6A', '#000000'],
	['Koraal', '#E89B88', '#000000'],
	['Baby blauw', '#8DDEE7', '#000000', undefined, '#005F69'],
	['Blush', '#E694B3', '#000000'],
	['Donker lila', '#A293AF', '#000000'],
	['Mist', '#91A9A7', '#000000'],
	['Sepia', '#EDD6C4', '#000000'],
	['Mauve', '#9B6072', '#FFFFFF'],
	['Salie', '#B8BE9A', '#000000'],
	['Terra', '#D1543A', '#000000'],
	['Olijf', '#64702B', '#FFFFFF'],
	['Viool', '#432457', '#FFFFFF'],
	// Not in the PDF; temporarily follows Baby blauw while meemoo decides whether it remains.
	['Sky blauw', '#C3DDE6', '#000000', undefined, '#005F69'],
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

	// Color.Black is '#000' and Color.White is '#FFF', and Color.Lila is lowercase, so lookups have
	// to normalise rather than match the enum value verbatim.
	it('accepts the shorthand and mixed casing the Color enum uses', () => {
		expect(getBackgroundTextColors(Color.Black)?.primary).toBe('#FFFFFF');
		expect(getBackgroundTextColors(Color.White)?.primary).toBe('#000000');
		expect(getBackgroundTextColors(Color.Lila)?.primary).toBe('#000000');
		expect(getBackgroundTextColors(Color.OldPink)?.primary).toBe('#FFFFFF');
		expect(getBackgroundTextColors(Color.BabyBlue)?.hyperlink).toBe('#005F69');
		expect(getBackgroundTextColors(Color.SkyBlue)).toEqual(getBackgroundTextColors(Color.BabyBlue));
	});

	it('renders legacy Poederblauw as Baby blauw without keeping a separate palette record', () => {
		expect(getBackgroundTextColors('#BDDEE7')).toEqual(getBackgroundTextColors(Color.BabyBlue));
		expect(BACKGROUND_TEXT_COLORS).not.toHaveProperty('#bddee7');
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
	it.each([
		['transparent', Color.Transparent],
		['the separately handled black-white gradient', GradientColor.BlackWhite],
		['the meemoo logo pattern', CustomBackground.MeemooLogo],
		['an AVO-only color', Color.SoftBlue],
		['no background', undefined],
		['an empty background', ''],
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
			'--bg-text-primary': '#FFFFFF',
			'--bg-text-secondary': '#ADADAD',
			'--bg-text-hyperlink': '#00C8AA',
		});
	});

	// Leaving them unset is what makes the utility classes fall back to the primary color.
	it('omits the roles design did not specify', () => {
		expect(getBackgroundTextColorVariables(Color.OldPink)).toEqual({
			'--bg-text-primary': '#FFFFFF',
		});
	});

	it('returns nothing for a background design specified no colors for', () => {
		expect(getBackgroundTextColorVariables(GradientColor.BlackWhite)).toEqual({});
	});
});
