export interface LineBox {
	top: number;
	left: number;
	width: number;
	height: number;
}

// Reads the block's own &__image --parallax-speed custom property (see .scss) instead of
// duplicating the number in JS - the .scss derives its oversize height from the same property.
export const readParallaxSpeed = (el: Element, fallback = 0.5): number => {
	const value = Number.parseFloat(getComputedStyle(el).getPropertyValue('--parallax-speed'));
	return value > 0 ? value : fallback;
};

// Calls `onChange` once immediately, then again whenever the OS-level preference flips - avoids
// re-querying matchMedia() on every animation frame.
export const watchReducedMotion = (onChange: (reduced: boolean) => void): (() => void) => {
	if (typeof window === 'undefined' || !window.matchMedia) {
		onChange(false);
		return () => undefined;
	}

	const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
	const listener = (event: MediaQueryListEvent) => onChange(event.matches);

	onChange(mediaQuery.matches);
	mediaQuery.addEventListener('change', listener);

	return () => mediaQuery.removeEventListener('change', listener);
};

const rootFontSizePx = (): number =>
	Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

// --h-pad (see .scss) is a plain rem number with no layout effect of its own.
const readPaddingPx = (el: Element, customProperty: string): number =>
	(Number.parseFloat(getComputedStyle(el).getPropertyValue(customProperty)) || 0) *
	rootFontSizePx();

// One decorative highlight box per rendered line of textEl, positioned relative to wrapperEl.
export const computeLineBoxes = (wrapperEl: HTMLElement, textEl: HTMLElement): LineBox[] => {
	const wrapperRect = wrapperEl.getBoundingClientRect();
	const hPad = readPaddingPx(wrapperEl, '--h-pad');
	const rects = Array.from(textEl.getClientRects());
	const lastIndex = rects.length - 1;

	return rects.map((rect, index) => {
		const isFirst = index === 0;
		const isLast = index === lastIndex;
		// A loaded font's ascent/descent can exceed the (deliberately tight) line-height, which
		// inflates rect.top/bottom beyond the real spacing between lines - so internal boundaries
		// use the next line's own top, and the outer edges use wrapperEl's real box instead.
		const rawTop = isFirst ? wrapperRect.top : rect.top;
		const rawBottom = isLast ? wrapperRect.bottom : rects[index + 1].top;
		const top = rawTop - wrapperRect.top;
		const bottom = rawBottom - wrapperRect.top;
		const left = rect.left - wrapperRect.left - hPad;
		const right = rect.right - wrapperRect.left + hPad;

		return { top, left, width: right - left, height: bottom - top };
	});
};
