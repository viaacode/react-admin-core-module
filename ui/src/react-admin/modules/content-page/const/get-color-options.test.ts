import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Color, CustomBackground, GradientColor } from '../types/content-block.types';
import { GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF, hasDarkBackground } from './get-color-options';

const isAvoMock = vi.hoisted(() => vi.fn<() => boolean>());

vi.mock('~shared/helpers/is-avo', () => ({ isAvo: isAvoMock }));

// The option labels are translated, which needs an initialised AdminConfigManager. These tests are
// about colors, not labels, so the key stands in for the label.
vi.mock('~shared/helpers/translation-functions', () => ({ tText: (key: string) => key }));

/**
 * Every background row of meemoo-hetarchief-kleurencombinaties.pdf, the design meemoo delivered on
 * https://meemoo.atlassian.net/browse/ARC-3848, as [name, background, prescribed text color].
 *
 * This is the fixture the computed rule is asserted against, so the PDF stays the authority without
 * anyone hand-maintaining a second list of colors in the source.
 *
 * One row is deliberately absent: Zink #ADADAD, which the PDF prescribes white text on even though
 * white scores 2.24:1 there - below AA, and below even the 3:1 large-text threshold. It looks like
 * an error in the PDF. It is not selectable as a background (foreground option only), so it changes
 * nothing today; raised with design rather than encoded here.
 */
const KLEURENCOMBINATIES_PDF: [string, string, 'wit' | 'zwart'][] = [
	// Merk
	['Zwart', '#000000', 'wit'],
	['Wit', '#FFFFFF', 'zwart'],
	['Teal', '#00C8AA', 'zwart'],
	// Functioneel
	['Grafiet', '#222222', 'wit'],
	['Inkt', '#303030', 'wit'],
	['Schaduw', '#505050', 'wit'],
	['Leisteen', '#666666', 'wit'],
	['Neutraal', '#757575', 'wit'],
	['Zilver', '#E6E6E6', 'zwart'],
	['Platinum', '#F8F8F8', 'zwart'],
	['Kers', '#D60039', 'wit'],
	['Jade', '#00857D', 'wit'],
	['Lagune', '#005F69', 'wit'],
	// Secundair
	['Zeegroen', '#009690', 'zwart'],
	['Grasgroen', '#82E678', 'zwart'],
	['Azuur', '#28A0C8', 'zwart'],
	// Tertiair
	['Lila', '#C6C2E0', 'zwart'],
	['Mosterd', '#EFCA6A', 'zwart'],
	['Koraal', '#E89B88', 'zwart'],
	['Baby blauw', '#8DDEE7', 'zwart'],
	['Blush', '#E694B3', 'zwart'],
	['Donker lila', '#A293AF', 'zwart'],
	['Mist', '#91A9A7', 'zwart'],
	['Sepia', '#EDD6C4', 'zwart'],
	['Mauve', '#9B6072', 'wit'],
	['Salie', '#B8BE9A', 'zwart'],
	['Terra', '#D1543A', 'zwart'],
	['Olijf', '#64702B', 'wit'],
	['Viool', '#432457', 'wit'],
];

describe('hasDarkBackground()', () => {
	describe('on hetarchief', () => {
		beforeEach(() => {
			isAvoMock.mockReturnValue(false);
		});

		it.each(KLEURENCOMBINATIES_PDF)(
			'puts %s text on %s (%s), like the design',
			(_name, background, textColor) => {
				expect(hasDarkBackground(background)).toBe(textColor === 'wit');
			}
		);

		// Guards the two colors the old shared AVO list got backwards: white text scored 2.13:1 on
		// ocean green and 3.64:1 on sea green, both unreadable.
		it.each([Color.OceanGreen, Color.SeaGreen])('keeps black text on %s', (color) => {
			expect(hasDarkBackground(color)).toBe(false);
		});

		it('puts white text on old pink, the tertiary color that needs it', () => {
			expect(hasDarkBackground(Color.OldPink)).toBe(true);
		});

		// The point of computing instead of listing: every pickable background gets an answer, so a
		// color added to the palette can never silently miss out on a text color ruling.
		it('rules on every background the admin can pick', () => {
			const undecidable: (Color | GradientColor | CustomBackground)[] = [
				Color.Transparent,
				GradientColor.BlackWhite,
				CustomBackground.MeemooLogo,
			];

			// Note Color.Black is '#000' and Color.White is '#FFF', so shorthand hex has to work.
			const needsWhiteText: string[] = [Color.Black, Color.OldPink];

			const flatColors = GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF()
				.map((option) => option.value)
				.filter((value) => !undecidable.includes(value));

			expect(flatColors.length).toBeGreaterThan(0);

			for (const color of flatColors) {
				expect(hasDarkBackground(color), `wrong ruling for ${color}`).toBe(
					needsWhiteText.includes(color)
				);
			}
		});
	});

	describe('on avo', () => {
		beforeEach(() => {
			isAvoMock.mockReturnValue(true);
		});

		// AVO's palette predates the rule and does not follow it, so it stays a literal list and must
		// not be recomputed - white on Color.Yellow is 1.2:1, but the AVO brand book asks for it.
		it.each([Color.OceanGreen, Color.SeaGreen, Color.Yellow, Color.Black])(
			'keeps the legacy white text on %s',
			(color) => {
				expect(hasDarkBackground(color)).toBe(true);
			}
		);

		it('keeps black text on white', () => {
			expect(hasDarkBackground(Color.White)).toBe(false);
		});
	});

	describe('backgrounds without a single luminance', () => {
		beforeEach(() => {
			isAvoMock.mockReturnValue(false);
		});

		// None of these can be reduced to one contrast ratio, so they keep the default black text.
		it.each([
			['a gradient', GradientColor.BlackWhite],
			['the meemoo logo pattern', CustomBackground.MeemooLogo],
			['transparent', Color.Transparent],
			['no background at all', undefined],
			['an empty background', ''],
		])('keeps black text on %s', (_name, color) => {
			expect(hasDarkBackground(color)).toBe(false);
		});
	});
});
