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

interface ParallaxInput {
	/** Block's current top relative to the viewport (getBoundingClientRect().top) */
	top: number;
	height: number;
	/** Block's top relative to the document, i.e. its viewport top at scrollY = 0 */
	documentTop: number;
	viewportHeight: number;
	speed: number;
}

// Maps the block's progress through the viewport onto the image's full oversize range
// (0 to -height * speed, see the .scss). Progress starts where the block first becomes visible:
// its on-load position when it's already in view (e.g. right below the navigation), otherwise
// the moment its top enters at the bottom of the viewport. It ends once the block's bottom leaves
// at the top. So every block on the page visibly moves while it's on screen, from the first scroll.
export const computeParallaxOffset = ({
	top,
	height,
	documentTop,
	viewportHeight,
	speed,
}: ParallaxInput): number => {
	const start = Math.min(documentTop, viewportHeight);
	const distance = start + height;
	if (distance <= 0) {
		return 0;
	}
	const progress = Math.max(0, Math.min(1, (start - top) / distance));
	return progress > 0 ? -progress * height * speed : 0;
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

// --h-pad/--v-pad (see .scss) are plain rem numbers, no layout effect of their own - --v-pad
// mirrors the wrapper's real padding so the outermost line's box lands on its edge (see below).
const readPixelCustomProperty = (el: Element, customProperty: string): number =>
	(Number.parseFloat(getComputedStyle(el).getPropertyValue(customProperty)) || 0) *
	rootFontSizePx();

// One box per rendered line, sized to that line's own rect plus --h-pad/--v-pad. textEl itself
// has no padding or box-decoration-break - only line-height decides where its glyphs sit, so
// these purely decorative boxes behind it can safely overlap each other (same color, invisible)
// when the padding is bigger than the gap between two lines, without ever touching the glyphs.
export const computeLineBoxes = (wrapperEl: HTMLElement, textEl: HTMLElement): LineBox[] => {
	const wrapperRect = wrapperEl.getBoundingClientRect();
	const hPad = readPixelCustomProperty(wrapperEl, '--h-pad');
	const vPad = readPixelCustomProperty(wrapperEl, '--v-pad');

	return Array.from(textEl.getClientRects()).map((rect) => ({
		top: rect.top - wrapperRect.top - vPad,
		left: rect.left - wrapperRect.left - hPad,
		width: rect.width + hPad * 2,
		height: rect.height + vPad * 2,
	}));
};
