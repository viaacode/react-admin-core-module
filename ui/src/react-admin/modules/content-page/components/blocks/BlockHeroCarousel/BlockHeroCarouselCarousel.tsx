import clsx from 'clsx';
import React, {
	type FunctionComponent,
	type ReactElement,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import type SwiperController from 'swiper';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { HeroCarouselSlideItem } from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.types.ts';
import { BlockHeroCarouselActiveSlide } from '~content-blocks/BlockHeroCarousel/BlockHeroCarouselActiveSlide.tsx';
import { BlockHeroCarouselInactiveSlide } from '~content-blocks/BlockHeroCarousel/BlockHeroCarouselInactiveSlide.tsx';
import { CarouselButtons } from '~modules/content-page/components/CarouselButtons/CarouselButtons.tsx';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import {
	ACTIVE_SLIDE_CLASS,
	buildInfiniteStrip,
	goToSlide,
	handleActiveIndexChange,
	handleBeforeSlideChangeStart,
	handleSetTranslate,
	handleSwiperMount,
	handleTransitionEnd,
} from './BlockHeroCarousel.utils.ts';

import 'swiper/css';
import './BlockHeroCarousel.scss';
import { ObjectMetadata } from '~modules/content-page/components/ObjectMetadata/ObjectMetadata.tsx';
import type { PlayableDisplayIeObject } from '~shared/services/ie-objects-service/ie-objects.types.ts';

export interface BlockHeroCarouselCarouselProps extends DefaultComponentProps {
	elements: HeroCarouselSlideItem[];
	isLoading?: boolean;
}

export const BlockHeroCarouselCarousel: FunctionComponent<BlockHeroCarouselCarouselProps> = ({
	elements,
	isLoading,
}): ReactElement => {
	const [controlledSwiper, setControlledSwiper] = useState<SwiperController | null>(null);
	const { strip, startIndex, itemsLength } = useMemo(
		() => buildInfiniteStrip(elements),
		[elements]
	);
	const [activeIndex, setActiveIndex] = useState<number>(startIndex);
	// Only updated once a navigation has fully settled (transition end, or an instant recenter
	// jump) -- unlike activeIndex, which must update the moment navigation starts so the
	// grow/shrink sizing animates immediately.
	const [settledActiveIndex, setSettledActiveIndex] = useState<number>(startIndex);
	const activeIndexRef = useRef<number>(startIndex);
	const isRecenteringRef = useRef(false);
	const pendingCorrectionPxRef = useRef(0);
	const pendingDirectionRef = useRef<'next' | 'prev'>('next');
	const speed = 1300;

	// Guards against the module auto-starting on mount while still loading; once loaded, the
	// prop change alone isn't reliable, so we also explicitly (re)start it here.
	useEffect(() => {
		if (!controlledSwiper || controlledSwiper.destroyed) {
			return;
		}
		if (isLoading) {
			controlledSwiper.autoplay?.stop();
		} else {
			controlledSwiper.autoplay?.start();
		}
	}, [isLoading, controlledSwiper]);

	return (
		<div className={clsx('c-block-hero-carousel__carousel')}>
			<Swiper
				className={'c-block-hero-carousel__carousel-swiper'}
				modules={[Autoplay]}
				autoplay={
					isLoading
						? false
						: {
								waitForTransition: false,
								delay: speed + 5000, // we need to take the transition into consideration
							}
				}
				slidesPerView="auto"
				spaceBetween={12}
				speed={speed}
				initialSlide={startIndex}
				allowTouchMove={false}
				simulateTouch={false}
				// Lets us apply our own grow/shrink-corrected translate in onSetTranslate
				// instead of Swiper writing straight to the wrapper.
				virtualTranslate={true}
				onSwiper={(swiperInstance) =>
					handleSwiperMount(swiperInstance, pendingDirectionRef, setControlledSwiper)
				}
				onBeforeSlideChangeStart={(swiperInstance) =>
					handleBeforeSlideChangeStart(
						swiperInstance,
						strip,
						isRecenteringRef,
						pendingDirectionRef,
						pendingCorrectionPxRef
					)
				}
				onSetTranslate={(swiperInstance, translate) =>
					handleSetTranslate(swiperInstance, translate, pendingCorrectionPxRef)
				}
				onActiveIndexChange={(swiperInstance) =>
					handleActiveIndexChange(swiperInstance, isRecenteringRef, activeIndexRef, setActiveIndex)
				}
				onTransitionEnd={(swiperInstance) =>
					handleTransitionEnd(swiperInstance, {
						startIndex,
						itemsLength,
						stripLength: strip.length,
						isRecenteringRef,
						activeIndexRef,
						pendingCorrectionPxRef,
						setActiveIndex,
						setSettledActiveIndex,
					})
				}
			>
				{strip.map(
					(
						{
							schemaIdentifier,
							name,
							thumbnailUrl,
							newspaperImage,
							videoThumbnail,
							dctermsFormat,
							backgroundColor,
						},
						index
					) => {
						// The active slide's real content only takes over once its navigation has
						// settled; every other slide (including one mid-transition into becoming
						// active) shows the lighter-weight inactive content.
						const isSettledActive = index === activeIndex && index === settledActiveIndex;

						return (
							<SwiperSlide
								// biome-ignore lint/suspicious/noArrayIndexKey: strip repeats real elements, so schemaIdentifier alone isn't unique per slide
								key={`carousel-slide__${schemaIdentifier}__${index}`}
								onClick={() =>
									goToSlide(controlledSwiper, index, activeIndexRef, pendingDirectionRef)
								}
								className={clsx(
									'c-block-hero-carousel__carousel-slide',
									`c-block-hero-carousel__carousel-slide--${dctermsFormat}`,
									index === activeIndex && ACTIVE_SLIDE_CLASS
								)}
								style={{
									backgroundColor,
								}}
							>
								{isSettledActive ? (
									<BlockHeroCarouselActiveSlide
										schemaIdentifier={schemaIdentifier}
										name={name}
										thumbnailUrl={thumbnailUrl}
										newspaperImage={newspaperImage}
										videoThumbnail={videoThumbnail}
										isLoading={isLoading}
									/>
								) : (
									<BlockHeroCarouselInactiveSlide
										schemaIdentifier={schemaIdentifier}
										name={name}
										thumbnailUrl={thumbnailUrl}
										videoThumbnail={videoThumbnail}
										isLoading={isLoading}
									/>
								)}
							</SwiperSlide>
						);
					}
				)}
				<CarouselButtons
					controlledSwiper={controlledSwiper}
					isLoopedCarousel={true}
					className={'c-block-hero-carousel__carousel-navigation'}
				/>
			</Swiper>
			<ObjectMetadata
				className={'c-block-hero-carousel__carousel-metadata'}
				ieObject={strip?.[activeIndex] as PlayableDisplayIeObject}
				fallbackTitle=""
			/>
		</div>
	);
};
