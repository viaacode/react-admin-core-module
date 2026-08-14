import type { RefObject } from 'react';
import { flushSync } from 'react-dom';
import type SwiperController from 'swiper';
import { ObjectType } from '~shared/helpers/mapFormatToType.ts';

// Keep in sync with the sizes in BlockHeroCarousel.scss.
const ACTIVE_WIDTH_REM = 51.2;
const FALLBACK_THUMB_WIDTH_REM = 12;
const FORMAT_THUMB_WIDTHS_REM: Record<ObjectType, number> = {
	[ObjectType.video]: 28,
	[ObjectType.videofragment]: 28,
	[ObjectType.film]: 28,
	[ObjectType.audio]: 16,
	[ObjectType.audiofragment]: 16,
	[ObjectType.newspaper]: 12,
	[ObjectType.newspaperpage]: 12,
	[ObjectType.image]: 12,
};

export const ACTIVE_SLIDE_CLASS = 'c-block-hero-carousel__carousel-slide--active';

interface StripItem {
	dctermsFormat: ObjectType;
}

type Direction = 'next' | 'prev';

const getThumbWidthRem = (format: ObjectType | undefined): number =>
	(format && FORMAT_THUMB_WIDTHS_REM[format]) || FALLBACK_THUMB_WIDTH_REM;

// How much translate needs to be nudged to keep the new active slide flush-left once the
// outgoing slide (currently active, at ACTIVE_WIDTH_REM) shrinks back to its own rest width.
const getShrinkCorrectionPx = (outgoingFormat: ObjectType | undefined): number => {
	const remToPx = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
	return (ACTIVE_WIDTH_REM - getThumbWidthRem(outgoingFormat)) * remToPx;
};

// Swiper caches slidesGrid/snapGrid and only recomputes them on specific triggers -- it
// doesn't know our CSS transition (or a recenter's instant swap) just resized a slide.
// Refreshing them and re-snapping translate to the given index keeps the *next* navigation
// targeting correctly instead of using a stale layout.
function refreshGridAndResync(swiperInstance: SwiperController, index: number): void {
	swiperInstance.updateSlides();
	swiperInstance.updateSlidesClasses();
	swiperInstance.slideTo(index, 0, false);
}

// Runs `fn` (a DOM mutation, e.g. a class swap) with each element's CSS transition
// suppressed, so any resize it triggers lands instantly instead of animating. Suppression
// must be set with `important` priority -- the stylesheet's own transition rule is
// `!important` (needed to beat swiper's base CSS), which otherwise wins over a plain inline
// style. The forced offsetHeight read in between is required too: without it the browser
// can coalesce the whole none-then-normal flip into one frame and animate anyway.
function withoutTransition(elements: (HTMLElement | undefined)[], fn: () => void): void {
	for (const el of elements) {
		el?.style.setProperty('transition', 'none', 'important');
	}
	fn();
	for (const el of elements) {
		void el?.offsetHeight;
	}
	for (const el of elements) {
		el?.style.removeProperty('transition');
	}
}

// Swiper's own `loop: true` corrupts its index bookkeeping once slidesPerView="auto" is
// combined with variable slide widths (loopFix physically reorders DOM nodes on the fly).
// We fake "infinite" scrolling instead: a static strip of repeated copies of the real
// elements, starting in the middle, with a 0-duration recenter jump whenever navigation
// comes within VISIBLE_SLIDES_BUFFER slides of either end -- the landing slide is
// content-identical, so the jump itself is invisible.
//
// VISIBLE_SLIDES_BUFFER just needs to comfortably exceed the most slides that could ever be
// on screen at once, so recentering never has to happen mid-viewport. Worst case is a very
// wide viewport showing only the smallest (12rem/192px) non-active slides: even a 4K-wide
// screen only fits roughly (3840 - 819) / 192 ≈ 15 of those beside the active slide.
const VISIBLE_SLIDES_BUFFER = 24;

export interface InfiniteStrip<T> {
	strip: T[];
	startIndex: number;
	itemsLength: number;
}

export function buildInfiniteStrip<T>(items: T[]): InfiniteStrip<T> {
	if (items.length === 0) {
		return { strip: items, startIndex: 0, itemsLength: 0 };
	}
	let copies = Math.ceil((items.length + 2 * VISIBLE_SLIDES_BUFFER) / items.length);
	if (copies < 3) {
		copies = 3;
	}
	if (copies % 2 === 0) {
		copies += 1; // keep an odd count so there's one exact middle copy to start/recenter into
	}
	const strip = Array.from({ length: copies * items.length }, (_, i) => items[i % items.length]);
	const startIndex = ((copies - 1) / 2) * items.length;
	return { strip, startIndex, itemsLength: items.length };
}

// Patches slideNext/slidePrev on the swiper instance so we always know which direction
// triggered the current navigation, regardless of who calls it (our own buttons, the
// parent's CarouselButtons, or a future touch swipe) -- handleBeforeSlideChangeStart needs
// it but isn't given the target index.
export function handleSwiperMount(
	swiperInstance: SwiperController,
	pendingDirectionRef: RefObject<Direction>,
	setControlledSwiper: (swiperInstance: SwiperController) => void
): void {
	const originalSlideNext = swiperInstance.slideNext.bind(swiperInstance);
	const originalSlidePrev = swiperInstance.slidePrev.bind(swiperInstance);
	swiperInstance.slideNext = (...args) => {
		pendingDirectionRef.current = 'next';
		return originalSlideNext(...args);
	};
	swiperInstance.slidePrev = (...args) => {
		pendingDirectionRef.current = 'prev';
		return originalSlidePrev(...args);
	};
	setControlledSwiper(swiperInstance);
}

// Swiper's target aims at the current active slide's flush-left position using its size
// as-is, so it can't account for that slide shrinking over the next 0.5s. That only throws
// off the new active slide's position when the shrinking slide sits before it in flow order
// (navigating "next"); "prev" needs no correction.
export function handleBeforeSlideChangeStart<T extends StripItem>(
	swiperInstance: SwiperController,
	strip: T[],
	isRecenteringRef: RefObject<boolean>,
	pendingDirectionRef: RefObject<Direction>,
	pendingCorrectionPxRef: RefObject<number>
): void {
	if (isRecenteringRef.current) {
		return;
	}
	if (pendingDirectionRef.current !== 'next') {
		pendingCorrectionPxRef.current = 0;
		return;
	}
	pendingCorrectionPxRef.current = getShrinkCorrectionPx(
		strip[swiperInstance.activeIndex]?.dctermsFormat
	);
}

// The correction is applied here, not consumed, because Swiper re-emits setTranslate with
// its own uncorrected value on every slide image load while a transition is still in
// flight -- consuming it after one use would let such a call win.
export function handleSetTranslate(
	swiperInstance: SwiperController,
	translate: number,
	pendingCorrectionPxRef: RefObject<number>
): void {
	const x = translate + pendingCorrectionPxRef.current - swiperInstance.cssOverflowAdjustment();
	swiperInstance.wrapperEl.style.transform = `translate3d(${x}px, 0px, 0px)`;
}

export function handleActiveIndexChange(
	swiperInstance: SwiperController,
	isRecenteringRef: RefObject<boolean>,
	activeIndexRef: RefObject<number>,
	setActiveIndex: (index: number) => void
): void {
	if (isRecenteringRef.current) {
		return;
	}
	activeIndexRef.current = swiperInstance.activeIndex;
	setActiveIndex(swiperInstance.activeIndex);
}

export interface TransitionEndDeps {
	startIndex: number;
	itemsLength: number;
	stripLength: number;
	isRecenteringRef: RefObject<boolean>;
	activeIndexRef: RefObject<number>;
	pendingCorrectionPxRef: RefObject<number>;
	setActiveIndex: (index: number) => void;
	setSettledActiveIndex: (index: number) => void;
}

// The active slide's own content (as opposed to its grow/shrink sizing, which must react the
// instant navigation starts) should only render once a navigation has fully settled -- this is
// only ever updated here and by the instant recenter jump below, never on navigation start.
export function handleTransitionEnd(
	swiperInstance: SwiperController,
	deps: TransitionEndDeps
): void {
	const {
		startIndex,
		itemsLength,
		stripLength,
		isRecenteringRef,
		activeIndexRef,
		pendingCorrectionPxRef,
		setActiveIndex,
		setSettledActiveIndex,
	} = deps;
	pendingCorrectionPxRef.current = 0;
	refreshGridAndResync(swiperInstance, swiperInstance.activeIndex);
	setSettledActiveIndex(swiperInstance.activeIndex);
	recenterIfNeeded(swiperInstance, {
		startIndex,
		itemsLength,
		stripLength,
		isRecenteringRef,
		activeIndexRef,
		setActiveIndex,
		setSettledActiveIndex,
	});
}

function recenterIfNeeded(
	swiperInstance: SwiperController,
	deps: {
		startIndex: number;
		itemsLength: number;
		stripLength: number;
		isRecenteringRef: RefObject<boolean>;
		activeIndexRef: RefObject<number>;
		setActiveIndex: (index: number) => void;
		setSettledActiveIndex: (index: number) => void;
	}
): void {
	const {
		startIndex,
		itemsLength,
		stripLength,
		isRecenteringRef,
		activeIndexRef,
		setActiveIndex,
		setSettledActiveIndex,
	} = deps;
	if (itemsLength === 0) {
		return;
	}
	const current = swiperInstance.activeIndex;
	const nearStart = current < VISIBLE_SLIDES_BUFFER;
	const nearEnd = current >= stripLength - VISIBLE_SLIDES_BUFFER;
	if (!nearStart && !nearEnd) {
		return;
	}
	const target = startIndex + (current % itemsLength);
	if (target === current) {
		return;
	}
	isRecenteringRef.current = true;
	swiperInstance.slideTo(target, 0, false);
	activeIndexRef.current = target;
	// The active class is about to jump from the old node to the new one -- but the target
	// is content-identical, so nothing should visibly resize.
	const outgoingEl = swiperInstance.slides[current] as HTMLElement | undefined;
	const incomingEl = swiperInstance.slides[target] as HTMLElement | undefined;
	withoutTransition([outgoingEl, incomingEl], () =>
		flushSync(() => {
			setActiveIndex(target);
			setSettledActiveIndex(target);
		})
	);
	// The recenter's own instant resize (outgoing shrinks, incoming grows) is just as
	// disruptive to the cached grid as a real navigation's resize.
	refreshGridAndResync(swiperInstance, target);
	isRecenteringRef.current = false;
}

// Navigates to a clicked slide with the same corrected animation as the next/prev buttons.
export function goToSlide(
	controlledSwiper: SwiperController | null,
	targetIndex: number,
	activeIndexRef: RefObject<number>,
	pendingDirectionRef: RefObject<Direction>
): void {
	if (!controlledSwiper || targetIndex === activeIndexRef.current) {
		return;
	}
	pendingDirectionRef.current = targetIndex > activeIndexRef.current ? 'next' : 'prev';
	controlledSwiper.slideTo(targetIndex);
}
