import type { RefObject } from 'react';
import { flushSync } from 'react-dom';
import { ObjectType } from '~shared/helpers/map-format-to-type.ts';

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

// Keep in sync with &__carousel-track's `gap: 1.2rem` in BlockHeroCarousel.scss.
export const GAP_PX = 12;

interface StripItem {
	dctermsFormat: ObjectType;
}

export function getThumbWidthRem(format: ObjectType | undefined): number {
	return (format && FORMAT_THUMB_WIDTHS_REM[format]) || FALLBACK_THUMB_WIDTH_REM;
}

export function getPxPerRem(): number {
	return Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
}

// A CSS transition can't animate to a slide that doesn't exist yet, so wrapping smoothly from
// last-to-first (or vice versa) needs real duplicate slides to slide into. Rather than tiling
// whole extra copies of the item list (wasteful once it's long), we clone only the boundary
// window each direction needs, then recenter -- an invisible 0-duration jump, since the
// landing slide is content-identical -- once navigation drifts within buffer range of an end.
//
// The active slide is always flush-left, so only slides *after* it are ever visible, making
// the two directions asymmetric:
// - FORWARD_BUFFER must exceed the most slides that could ever be visible at once (a 4K screen
//   showing only the smallest 12rem slides fits ~15), so the viewport never runs out of real
//   content before a recenter kicks in.
// - BACKWARD_BUFFER isn't filling anything visible; it only needs to survive a burst of rapid
//   clicks before the next `transitionend` gets a chance to recenter (retargeting an in-flight
//   transition doesn't fire one of its own).
const FORWARD_BUFFER = 24;
const BACKWARD_BUFFER = 8;

function mod(n: number, m: number): number {
	return ((n % m) + m) % m;
}

export interface InfiniteStrip<T> {
	strip: T[];
	startIndex: number;
	itemsLength: number;
}

export function buildInfiniteStrip<T>(items: T[]): InfiniteStrip<T> {
	const itemsLength = items.length;
	if (itemsLength === 0) {
		return { strip: items, startIndex: 0, itemsLength: 0 };
	}
	const tailClones = Array.from(
		{ length: BACKWARD_BUFFER },
		(_, i) => items[mod(i - BACKWARD_BUFFER, itemsLength)]
	);
	const headClones = Array.from({ length: FORWARD_BUFFER }, (_, i) => items[i % itemsLength]);
	return {
		strip: [...tailClones, ...items, ...headClones],
		startIndex: BACKWARD_BUFFER,
		itemsLength,
	};
}

// The translateX magnitude that brings targetIndex flush left once navigation settles, summing
// every preceding slide's rest width (targetIndex itself -- the only active one -- is excluded).
// Since every slide's width transition shares the track's transform duration/easing, both stay
// in sync automatically at every frame -- no runtime correction needed.
export function computeOffsetPx<T extends StripItem>(
	strip: T[],
	targetIndex: number,
	pxPerRem: number
): number {
	let offset = 0;
	for (let i = 0; i < targetIndex; i++) {
		offset += getThumbWidthRem(strip[i]?.dctermsFormat) * pxPerRem + GAP_PX;
	}
	return offset;
}

// Runs `fn` with `el`'s transitions suppressed via the `is-instant` class, so the mutation
// lands instantly. The forced offsetHeight read in between is required: without it the browser
// can coalesce the whole class toggle into one frame and animate anyway.
function withoutTransition(el: HTMLElement | null | undefined, fn: () => void): void {
	el?.classList.add('is-instant');
	fn();
	void el?.offsetHeight;
	el?.classList.remove('is-instant');
}

export interface RecenterDeps<T extends StripItem> {
	strip: T[];
	startIndex: number;
	itemsLength: number;
	activeIndex: number;
	trackRef: RefObject<HTMLDivElement | null>;
	setActiveIndex: (index: number) => void;
	setSettledActiveIndex: (index: number) => void;
}

function recenterIfNeeded<T extends StripItem>(deps: RecenterDeps<T>): void {
	const {
		strip,
		startIndex,
		itemsLength,
		activeIndex,
		trackRef,
		setActiveIndex,
		setSettledActiveIndex,
	} = deps;
	if (itemsLength === 0) {
		return;
	}
	const nearStart = activeIndex < BACKWARD_BUFFER;
	const nearEnd = activeIndex >= strip.length - FORWARD_BUFFER;
	if (!nearStart && !nearEnd) {
		return;
	}
	// startIndex isn't a multiple of itemsLength (the strip clones a boundary window, not whole
	// item-list copies), so the target must be re-based relative to startIndex's own phase.
	const target = startIndex + mod(activeIndex - startIndex, itemsLength);
	if (target === activeIndex) {
		return;
	}
	withoutTransition(trackRef.current, () => {
		flushSync(() => {
			setActiveIndex(target);
			setSettledActiveIndex(target);
		});
	});
}

// Attach as the track's onTransitionEnd. e.target !== e.currentTarget filters out bubbled
// width/height/border transitionend events from child slides -- only the track's own transform
// transition should trigger settling logic.
export function handleTrackTransitionEnd<T extends StripItem>(
	e: { target: EventTarget | null; currentTarget: EventTarget | null; propertyName: string },
	deps: RecenterDeps<T>
): void {
	if (e.target !== e.currentTarget || e.propertyName !== 'transform') {
		return;
	}
	deps.setSettledActiveIndex(deps.activeIndex);
	recenterIfNeeded(deps);
}

// Re-syncs pxPerRem if the root font-size changed (e.g. a responsive html{font-size}
// breakpoint in the embedding app), snapping instantly since this is a layout fix, not a
// user-driven navigation.
export function handleWindowResize(
	pxPerRemRef: RefObject<number>,
	trackRef: RefObject<HTMLDivElement | null>,
	setPxPerRem: (pxPerRem: number) => void
): void {
	const next = getPxPerRem();
	if (next === pxPerRemRef.current) {
		return;
	}
	withoutTransition(trackRef.current, () => {
		flushSync(() => setPxPerRem(next));
	});
}
