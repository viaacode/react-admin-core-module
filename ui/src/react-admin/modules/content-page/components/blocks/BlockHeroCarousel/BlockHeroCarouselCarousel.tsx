import { Image } from '@viaa/avo2-components';
import clsx from 'clsx';
import React, { type FunctionComponent, type ReactElement, useMemo, useRef, useState } from 'react';
import type SwiperController from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { HeroCarouselBlockComponentState } from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.types.ts';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import { ObjectType } from '~shared/helpers/mapFormatToType.ts';
import type { IeObject } from '~shared/services/ie-objects-service/ie-objects.types.ts';

import 'swiper/css';
import './BlockHeroCarousel.scss';
import { CarouselButtons } from '~modules/content-page/components/CarouselButtons/CarouselButtons.tsx';

export interface BlockHeroCarouselCarouselProps extends DefaultComponentProps {
	elements: (HeroCarouselBlockComponentState & IeObject)[];
}

// Keep in sync with the sizes in BlockHeroCarousel.scss.
const ACTIVE_WIDTH_REM = 51.2;
const FALLBACK_THUMB_WIDTH_REM = 12;
const FORMAT_THUMB_WIDTHS_REM: Partial<Record<ObjectType, number>> = {
	[ObjectType.video]: 28,
	[ObjectType.videofragment]: 28,
	[ObjectType.film]: 28,
	[ObjectType.audio]: 16,
	[ObjectType.audiofragment]: 16,
	[ObjectType.newspaper]: 12,
	[ObjectType.newspaperpage]: 12,
};

const getThumbWidthRem = (format: ObjectType | undefined): number =>
	(format && FORMAT_THUMB_WIDTHS_REM[format]) || FALLBACK_THUMB_WIDTH_REM;

const ACTIVE_SLIDE_CLASS = 'c-block-hero-carousel__carousel-slide--active';

// Swiper's own `loop: true` recenters its buffer by physically moving <SwiperSlide> DOM
// nodes (prepend/append) once the active slide gets close to either edge. Combined with
// slidesPerView="auto" and widely-varying, animating slide widths, that recentering
// corrupts Swiper's own index/position bookkeeping (a known class of upstream issues,
// most visible on slidePrev()). Since we still want the real Swiper engine driving this
// (translate, slideTo, flex reflow -- not a custom positioning engine), we build the
// "infinite" feel ourselves instead: render one large, perfectly static strip made of many
// repeated copies of the real elements, start the user in the middle copy, and silently
// jump (0-duration slideTo, once the current transition has fully settled) back to the
// middle copy's equivalent slide whenever navigation gets close to either end. Every
// candidate landing slide has byte-identical content to the one being left, so the jump
// is visually a no-op -- it only restores headroom for more clicks in that direction.
const MIN_TOTAL_STRIP_SLIDES = 201;

interface InfiniteStrip<T> {
	strip: T[];
	startIndex: number;
	itemsLength: number;
}

function buildInfiniteStrip<T>(items: T[]): InfiniteStrip<T> {
	if (items.length === 0) {
		return { strip: items, startIndex: 0, itemsLength: 0 };
	}
	let copies = Math.ceil(MIN_TOTAL_STRIP_SLIDES / items.length);
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

export const BlockHeroCarouselCarousel: FunctionComponent<BlockHeroCarouselCarouselProps> = ({
	elements,
}): ReactElement => {
	const [controlledSwiper, setControlledSwiper] = useState<SwiperController | null>(null);
	const { strip, startIndex, itemsLength } = useMemo(
		() => buildInfiniteStrip(elements),
		[elements]
	);
	const [activeIndex, setActiveIndex] = useState<number>(startIndex);
	const activeIndexRef = useRef<number>(startIndex);
	// Set for the duration of our own silent recenter jump, so the activeIndexChange event
	// it triggers isn't mistaken for a real, user-facing navigation.
	const isRecenteringRef = useRef(false);
	// Extra px to layer onto the *next* setTranslate application (see onBeforeSlideChangeStart).
	const pendingCorrectionPxRef = useRef(0);
	// Which direction triggered the in-flight navigation. beforeSlideChangeStart doesn't
	// receive the target index, so direction can't be derived there -- slideNext/slidePrev
	// are intercepted (below, in onSwiper) purely to record which one was actually called.
	const pendingDirectionRef = useRef<'next' | 'prev'>('next');

	const recenterIfNeeded = (swiperInstance: SwiperController) => {
		if (itemsLength === 0) {
			return;
		}
		const current = swiperInstance.activeIndex;
		const stripLength = strip.length;
		const nearStart = current < itemsLength;
		const nearEnd = current >= stripLength - itemsLength;
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
		// The recenter's target slide has byte-identical content to the one being left, so
		// nothing should visibly grow/shrink here -- only the underlying array index changes.
		// But the active class is about to jump from the old DOM node to the new one, which
		// would otherwise kick off our normal 0.5s grow/shrink CSS transition on both (a
		// visible flash). Suspend that transition on exactly these two nodes for one frame
		// so the class swap lands instantly, then restore it for future real navigations.
		const outgoingEl = swiperInstance.slides[current] as HTMLElement | undefined;
		const incomingEl = swiperInstance.slides[target] as HTMLElement | undefined;
		outgoingEl?.style.setProperty('transition', 'none');
		incomingEl?.style.setProperty('transition', 'none');
		setActiveIndex(target);
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				outgoingEl?.style.removeProperty('transition');
				incomingEl?.style.removeProperty('transition');
			});
		});
		isRecenteringRef.current = false;
	};

	// Clicking a slide should navigate to it with the same grow/slide-into-place animation
	// as the next/prev buttons. The same correction rule applies regardless of how many
	// slides are being skipped: only one slide is ever active (819px) at a time, so a
	// correction is needed exactly when the *current* active slide -- the only one about to
	// shrink -- sits before the target in flow order (i.e. the target is further along).
	const goToSlide = (targetIndex: number) => {
		if (!controlledSwiper || targetIndex === activeIndexRef.current) {
			return;
		}
		pendingDirectionRef.current = targetIndex > activeIndexRef.current ? 'next' : 'prev';
		controlledSwiper.slideTo(targetIndex);
	};

	return (
		<div className={clsx('c-block-hero-carousel__carousel')}>
			<CarouselButtons controlledSwiper={controlledSwiper} isLoopedCarousel={true} />
			<Swiper
				className={'c-block-hero-carousel__carousel-swiper'}
				slidesPerView="auto"
				spaceBetween={12}
				speed={500}
				initialSlide={startIndex}
				allowTouchMove={false}
				// allowTouchMove alone blocks the drag from actually moving anything, but
				// Swiper still runs its touchmove bookkeeping on mouse gestures -- and,
				// specifically because allowTouchMove is false, that bookkeeping marks the
				// click as a rejected drag (`allowClick = false`) the moment it sees ANY
				// pointer movement between mousedown and mouseup, even a sub-pixel amount a
				// real mouse click can produce. simulateTouch=false makes Swiper ignore
				// mouse-originated touch events entirely, so a real click on a slide is
				// unaffected while dragging (mouse or touch) stays fully disabled.
				simulateTouch={false}
				// Swiper still computes translate/activeIndex/snapIndex internally exactly as
				// usual -- that bookkeeping needs to stay self-consistent for slideNext/Prev to
				// keep targeting correctly on later clicks. `virtualTranslate` just stops Swiper
				// itself from writing that translate to the wrapper's `transform`, so WE can, via
				// onSetTranslate below -- letting us layer our own grow/shrink correction onto
				// the *rendered* position without ever telling Swiper's own state about it.
				virtualTranslate={true}
				onSwiper={(swiperInstance) => {
					// Wrap so we always know which direction triggered the current
					// navigation, regardless of who calls it (our own buttons, the parent's
					// CarouselButtons, or a touch swipe defaulting to Swiper's own handling).
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
				}}
				onBeforeSlideChangeStart={(swiperInstance) => {
					if (isRecenteringRef.current) {
						return;
					}
					// Swiper is about to aim the wrapper at a target that correctly accounts
					// for the current slide layout, but using sizes as they are *right now* --
					// it has no way to know the current active slide is about to shrink over
					// the next 0.5s. That shrink only pulls the *new* active slide's flush-left
					// position off when the outgoing slide sits before it in flow order (i.e.
					// navigating "next"); for "prev" nothing before the new active slide is
					// changing size, so Swiper's own target is already correct there.
					if (pendingDirectionRef.current !== 'next') {
						pendingCorrectionPxRef.current = 0;
						return;
					}
					const outgoingFormat = strip[swiperInstance.activeIndex]?.dctermsFormat;
					const remToPx = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
					const outgoingRestWidthPx = getThumbWidthRem(outgoingFormat) * remToPx;
					pendingCorrectionPxRef.current = ACTIVE_WIDTH_REM * remToPx - outgoingRestWidthPx;
				}}
				onSetTranslate={(swiperInstance, translate) => {
					// Deliberately NOT cleared here. Swiper calls update() (re-emitting
					// setTranslate with its own, uncorrected value) on every slide image load
					// whenever slidesPerView="auto" -- with this many slides, that can fire
					// several times while our grow/shrink transition is still in flight. If the
					// correction were consumed after a single use, one of those image-load-
					// triggered calls would overwrite our corrected position with the naive one
					// and the click would settle in the wrong place. It's only cleared once the
					// transition genuinely ends (onTransitionEnd below), by which point the
					// real widths have settled and no correction is needed anymore.
					const correctedTranslate = translate + pendingCorrectionPxRef.current;
					const x = correctedTranslate - swiperInstance.cssOverflowAdjustment();
					swiperInstance.wrapperEl.style.transform = `translate3d(${x}px, 0px, 0px)`;
				}}
				onActiveIndexChange={(swiperInstance) => {
					if (isRecenteringRef.current) {
						return;
					}
					activeIndexRef.current = swiperInstance.activeIndex;
					setActiveIndex(swiperInstance.activeIndex);
				}}
				onTransitionEnd={(swiperInstance) => {
					pendingCorrectionPxRef.current = 0;
					// Swiper caches slidesGrid/snapGrid (each slide's computed position) and
					// only recomputes them on specific triggers (init, resize, explicit update
					// calls) -- it has no way to notice that our CSS grow/shrink transition
					// just finished changing a slide's width. Refreshing them now, once the
					// resize has fully settled, keeps the *next* click's target computation
					// accurate; without this it silently uses the width layout from several
					// clicks ago.
					swiperInstance.updateSlides();
					swiperInstance.updateSlidesClasses();
					// The freshly recomputed snapGrid entry for the current slide has now
					// shifted (the outgoing slide's width changed), but swiper.translate is
					// still the *old* value from click-time -- it no longer matches any
					// snapGrid entry. slideNext()/slidePrev() both do an exact lookup of
					// translate within snapGrid to find the adjacent target, so a stale,
					// off-grid translate makes the *next* click jump to a wrong slide.
					// Re-snapping (0-duration, same slide) resyncs translate to the fresh
					// grid without any visible change.
					swiperInstance.slideTo(swiperInstance.activeIndex, 0, false);
					recenterIfNeeded(swiperInstance);
				}}
			>
				{strip.map(
					({ schemaIdentifier, name, thumbnailUrl, videoThumbnail, dctermsFormat }, index) => {
						return (
							<SwiperSlide
								key={`carousel-slide__${schemaIdentifier}__${index}`}
								onClick={() => goToSlide(index)}
								className={clsx(
									'c-block-hero-carousel__carousel-slide',
									`c-block-hero-carousel__carousel-slide--${dctermsFormat}`,
									index === activeIndex && ACTIVE_SLIDE_CLASS
								)}
							>
								<Image
									src={videoThumbnail || thumbnailUrl}
									alt={name}
									className={clsx('c-block-hero-carousel__carousel-slide-image')}
								/>
							</SwiperSlide>
						);
					}
				)}
			</Swiper>
		</div>
	);
};
