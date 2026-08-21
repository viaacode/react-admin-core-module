import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	computeLineBoxes,
	readParallaxSpeed,
	watchReducedMotion,
} from './BlockTitleWithParallax.helpers';

const rect = (top: number, right: number, bottom: number, left: number): DOMRect =>
	({
		top,
		right,
		bottom,
		left,
		width: right - left,
		height: bottom - top,
		x: left,
		y: top,
		toJSON: () => ({}),
	}) as DOMRect;

const stubComputedStyle = (customProperties: Record<string, string>, fontSize = '16px') => {
	vi.spyOn(window, 'getComputedStyle').mockImplementation(
		() =>
			({
				fontSize,
				getPropertyValue: (property: string) => customProperties[property] ?? '',
			}) as CSSStyleDeclaration
	);
};

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe('computeLineBoxes', () => {
	it('snaps the outer edges to the wrapper rect and pads the sides by --h-pad', () => {
		stubComputedStyle({ '--h-pad': '1rem' });

		const wrapperEl = document.createElement('div');
		wrapperEl.getBoundingClientRect = () => rect(100, 300, 132, 100);

		const textEl = document.createElement('span');
		textEl.getClientRects = () => [rect(102, 250, 130, 120)] as unknown as DOMRectList;

		const [box] = computeLineBoxes(wrapperEl, textEl);

		// Outer top/bottom come from the wrapper, not the (font-inflated) text rect.
		expect(box.top).toBe(0);
		expect(box.height).toBe(32);
		// Sides are padded outward by --h-pad (1rem * 16px root font size = 16px).
		expect(box.left).toBe(120 - 100 - 16);
		expect(box.width).toBe(250 - 120 + 16 * 2);
	});

	it('derives an internal boundary from the next line, not the inflated rect.bottom', () => {
		stubComputedStyle({ '--h-pad': '0rem' });

		const wrapperEl = document.createElement('div');
		wrapperEl.getBoundingClientRect = () => rect(0, 300, 88, 0);

		const textEl = document.createElement('span');
		// A tight line-height (44) but a font whose own metrics report a taller rect.bottom (50).
		textEl.getClientRects = () =>
			[rect(0, 200, 50, 0), rect(44, 150, 88, 0)] as unknown as DOMRectList;

		const [first, second] = computeLineBoxes(wrapperEl, textEl);

		// First line's bottom is the second line's own top (44), not its own inflated bottom (50).
		expect(first.height).toBe(44);
		expect(second.top).toBe(44);
		// The two boxes are flush - no gap, no overlap.
		expect(first.top + first.height).toBe(second.top);
	});

	it('returns an empty array when there are no rendered lines', () => {
		stubComputedStyle({});

		const wrapperEl = document.createElement('div');
		wrapperEl.getBoundingClientRect = () => rect(0, 0, 0, 0);

		const textEl = document.createElement('span');
		textEl.getClientRects = () => [] as unknown as DOMRectList;

		expect(computeLineBoxes(wrapperEl, textEl)).toEqual([]);
	});
});

describe('readParallaxSpeed', () => {
	it('parses the --parallax-speed custom property', () => {
		stubComputedStyle({ '--parallax-speed': '0.5' });
		expect(readParallaxSpeed(document.createElement('div'))).toBe(0.5);
	});

	it('falls back when the property is missing, blank, or non-positive', () => {
		stubComputedStyle({});
		expect(readParallaxSpeed(document.createElement('div'), 0.25)).toBe(0.25);

		stubComputedStyle({ '--parallax-speed': '0' });
		expect(readParallaxSpeed(document.createElement('div'), 0.25)).toBe(0.25);

		stubComputedStyle({ '--parallax-speed': '-1' });
		expect(readParallaxSpeed(document.createElement('div'), 0.25)).toBe(0.25);
	});
});

describe('watchReducedMotion', () => {
	it('reports the initial preference and reacts to change events', () => {
		let changeListener: ((event: MediaQueryListEvent) => void) | undefined;
		const removeEventListener = vi.fn();
		const mediaQueryList = {
			matches: true,
			addEventListener: vi.fn((_event: string, listener: (event: MediaQueryListEvent) => void) => {
				changeListener = listener;
			}),
			removeEventListener,
		};
		vi.stubGlobal(
			'matchMedia',
			vi.fn().mockReturnValue(mediaQueryList as unknown as MediaQueryList)
		);

		const onChange = vi.fn();
		const unwatch = watchReducedMotion(onChange);

		expect(onChange).toHaveBeenCalledWith(true);

		changeListener?.({ matches: false } as MediaQueryListEvent);
		expect(onChange).toHaveBeenCalledWith(false);

		unwatch();
		expect(removeEventListener).toHaveBeenCalledWith('change', changeListener);
	});

	it('reports false and returns a no-op teardown when matchMedia is unavailable', () => {
		vi.stubGlobal('matchMedia', undefined);

		const onChange = vi.fn();
		expect(() => watchReducedMotion(onChange)()).not.toThrow();
		expect(onChange).toHaveBeenCalledWith(false);
	});
});
