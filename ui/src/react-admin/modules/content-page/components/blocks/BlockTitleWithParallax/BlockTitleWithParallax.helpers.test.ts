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
	it('expands each rendered line by --h-pad/--v-pad, read as plain rem numbers', () => {
		stubComputedStyle({ '--h-pad': '1rem', '--v-pad': '0.5rem' });

		const wrapperEl = document.createElement('h1');
		wrapperEl.getBoundingClientRect = () => rect(100, 300, 148, 100);

		const textEl = document.createElement('span');
		textEl.getClientRects = () => [rect(116, 250, 132, 120)] as unknown as DOMRectList;

		expect(computeLineBoxes(wrapperEl, textEl)).toEqual([
			{ top: 8, left: 4, width: 162, height: 32 },
		]);
	});

	it('returns one box per rendered line, each only as tall/wide as that line plus padding', () => {
		stubComputedStyle({ '--h-pad': '0rem', '--v-pad': '0rem' });

		const wrapperEl = document.createElement('h1');
		wrapperEl.getBoundingClientRect = () => rect(0, 300, 150, 0);

		const textEl = document.createElement('span');
		textEl.getClientRects = () =>
			[
				rect(10, 200, 40, 0),
				rect(50, 150, 80, 0),
				rect(90, 180, 140, 0),
			] as unknown as DOMRectList;

		expect(computeLineBoxes(wrapperEl, textEl)).toEqual([
			{ top: 10, left: 0, width: 200, height: 30 },
			{ top: 50, left: 0, width: 150, height: 30 },
			{ top: 90, left: 0, width: 180, height: 50 },
		]);
	});

	it('lets adjacent lines overlap once --v-pad exceeds the gap line-height leaves between them', () => {
		stubComputedStyle({ '--h-pad': '0rem', '--v-pad': '2rem' });

		const wrapperEl = document.createElement('h1');
		wrapperEl.getBoundingClientRect = () => rect(0, 300, 100, 0);

		const textEl = document.createElement('span');
		// Only a 10px natural gap between these two lines' own ink (40 to 50) - far less than the
		// 32px (2rem * 16px root) --v-pad each box extends by, so their boxes overlap by design.
		textEl.getClientRects = () =>
			[rect(0, 200, 40, 0), rect(50, 200, 90, 0)] as unknown as DOMRectList;

		const [first, second] = computeLineBoxes(wrapperEl, textEl);

		expect(first.top + first.height).toBeGreaterThan(second.top);
	});

	it('returns an empty array when there are no rendered lines', () => {
		stubComputedStyle({});

		const wrapperEl = document.createElement('h1');
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
