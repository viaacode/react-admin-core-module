import { afterEach, describe, expect, it, vi } from 'vitest';
import { computeIsStacked, STACKED_CLASS } from './BlockHetArchiefQuote.helpers';

// computeIsStacked only ever reads rect.left/rect.right.
const rect = (left: number, right: number): DOMRect => ({ left, right }) as DOMRect;

// Every test below runs at the 16px default root font size - none needs to vary it.
const stubComputedStyle = (customProperties: Record<string, string>) => {
	vi.spyOn(window, 'getComputedStyle').mockImplementation(
		() =>
			({
				fontSize: '16px',
				getPropertyValue: (property: string) => customProperties[property] ?? '',
			}) as CSSStyleDeclaration
	);
};

const figureEl = (left: number, right: number, stacked = false): Element => {
	const el = document.createElement('figure');
	if (stacked) {
		el.classList.add(STACKED_CLASS);
	}
	el.getBoundingClientRect = () => rect(left, right);
	return el;
};

afterEach(() => {
	vi.restoreAllMocks();
});

describe('computeIsStacked', () => {
	it('stays bled when the desktop bleed keeps clear of both viewport edges', () => {
		stubComputedStyle({ '--bleed': '4rem', '--stack-padding-x': '2rem' });

		// 4rem (64px) of bleed on each side, well clear of a 1024px viewport.
		expect(computeIsStacked(figureEl(64, 960), 1024)).toBe(false);
	});

	it('stacks once the desktop bleed would cross the left edge', () => {
		stubComputedStyle({ '--bleed': '4rem', '--stack-padding-x': '2rem' });

		// Column's true left edge sits at rect.left + bleed = 4px, so bleeding out by another 64px
		// would push 60px past the viewport's left edge.
		expect(computeIsStacked(figureEl(-60, 960), 1024)).toBe(true);
	});

	it('stacks once the desktop bleed would cross the right edge', () => {
		stubComputedStyle({ '--bleed': '4rem', '--stack-padding-x': '2rem' });

		// Column's true right edge sits at rect.right - bleed = 1084 - 64 = 1020, only 4px inside a
		// 1024px viewport - bleeding out by another 64px overshoots it by 60px.
		expect(computeIsStacked(figureEl(64, 1084), 1024)).toBe(true);
	});

	it('re-derives the bled gap from the stacked layout instead of measuring it directly', () => {
		stubComputedStyle({ '--bleed': '4rem', '--stack-padding-x': '2rem' });

		// Currently stacked (2rem/32px bleed): true left edge = rect.left + 32 = 40px. Bleeding out
		// by the desktop's 64px would only leave -24px of clearance, so it should stay stacked.
		expect(computeIsStacked(figureEl(8, 900, true), 1024)).toBe(true);
	});

	it('flips back to bled once the stacked layout would clear the desktop bleed', () => {
		stubComputedStyle({ '--bleed': '4rem', '--stack-padding-x': '2rem' });

		// Currently stacked: true left edge = rect.left + 32 = 132px, comfortably more than 64px.
		expect(computeIsStacked(figureEl(100, 900, true), 1024)).toBe(false);
	});

	it('falls back to 0 for missing or unparsable custom properties', () => {
		stubComputedStyle({});

		expect(computeIsStacked(figureEl(0, 1024), 1024)).toBe(false);
	});
});
