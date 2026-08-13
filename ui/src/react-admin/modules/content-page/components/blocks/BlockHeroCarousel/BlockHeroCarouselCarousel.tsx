import { Image } from '@viaa/avo2-components';
import clsx from 'clsx';
import React, { type FunctionComponent, type ReactElement, useMemo, useRef, useState } from 'react';
import type SwiperController from 'swiper';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { HeroCarouselBlockComponentState } from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.types.ts';
import { CarouselButtons } from '~modules/content-page/components/CarouselButtons/CarouselButtons.tsx';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import type { IeObject } from '~shared/services/ie-objects-service/ie-objects.types.ts';
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

export interface BlockHeroCarouselCarouselProps extends DefaultComponentProps {
	elements: (HeroCarouselBlockComponentState & IeObject)[];
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
	const isRecenteringRef = useRef(false);
	const pendingCorrectionPxRef = useRef(0);
	const pendingDirectionRef = useRef<'next' | 'prev'>('next');
	const speed = 1300;

	return (
		<div className={clsx('c-block-hero-carousel__carousel')}>
			<Swiper
				className={'c-block-hero-carousel__carousel-swiper'}
				modules={[Autoplay]}
				autoplay={{
					waitForTransition: false,
					delay: speed + 1000, // we need to take the transition into consideration
				}}
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
					})
				}
			>
				{strip.map(
					({ schemaIdentifier, name, thumbnailUrl, videoThumbnail, dctermsFormat }, index) => {
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
				<CarouselButtons
					controlledSwiper={controlledSwiper}
					isLoopedCarousel={true}
					className={'c-block-hero-carousel__carousel-navigation'}
				/>
			</Swiper>
		</div>
	);
};
