// biome-ignore-all lint/a11y/useKeyWithClickEvents: mouse-only slide click by design -- the strip's many duplicate slides shouldn't all become tab stops. (File-level because a per-line ignore here conflicts with the neighboring noArrayIndexKey ignore -- biome mis-attaches both when stacked on the same element.)
import clsx from 'clsx';
import React, {
	type FunctionComponent,
	type ReactElement,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import type { HeroCarouselSlideItem } from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.types.ts';
import { BlockHeroCarouselActiveSlide } from '~content-blocks/BlockHeroCarousel/BlockHeroCarouselActiveSlide.tsx';
import { BlockHeroCarouselInactiveSlide } from '~content-blocks/BlockHeroCarousel/BlockHeroCarouselInactiveSlide.tsx';
import { BlockHeroCarouselNavButtons } from '~content-blocks/BlockHeroCarousel/BlockHeroCarouselNavButtons.tsx';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import {
	ACTIVE_SLIDE_CLASS,
	buildInfiniteStrip,
	computeOffsetPx,
	getPxPerRem,
	goToSlide,
	handleTrackTransitionEnd,
	handleWindowResize,
} from './BlockHeroCarousel.utils.ts';

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
	const { strip, startIndex, itemsLength } = useMemo(
		() => buildInfiniteStrip(elements),
		[elements]
	);
	const [activeIndex, setActiveIndex] = useState<number>(startIndex);
	// Only updated once a navigation has fully settled (transition end, or an instant recenter
	// jump) -- unlike activeIndex, which must update the moment navigation starts so the
	// grow/shrink sizing animates immediately.
	const [settledActiveIndex, setSettledActiveIndex] = useState<number>(startIndex);
	const [pxPerRem, setPxPerRem] = useState<number>(() => getPxPerRem());
	const activeIndexRef = useRef<number>(startIndex);
	const pxPerRemRef = useRef<number>(pxPerRem);
	const trackRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		pxPerRemRef.current = pxPerRem;
	}, [pxPerRem]);

	useEffect(() => {
		const onResize = () => handleWindowResize(pxPerRemRef, trackRef, setPxPerRem);
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	const offsetPx = useMemo(
		() => computeOffsetPx(strip, activeIndex, pxPerRem),
		[strip, activeIndex, pxPerRem]
	);

	const handleGoToSlide = (targetIndex: number) =>
		goToSlide(targetIndex, activeIndexRef, setActiveIndex);
	const goNext = () => handleGoToSlide(activeIndexRef.current + 1);
	const goPrev = () => handleGoToSlide(activeIndexRef.current - 1);

	return (
		<div className={clsx('c-block-hero-carousel__carousel')}>
			<div className={clsx('c-block-hero-carousel__carousel-viewport')}>
				<div
					ref={trackRef}
					className={clsx('c-block-hero-carousel__carousel-track')}
					style={{ transform: `translateX(-${offsetPx}px)` }}
					onTransitionEnd={(e) =>
						handleTrackTransitionEnd(e, {
							strip,
							startIndex,
							itemsLength,
							activeIndexRef,
							trackRef,
							setActiveIndex,
							setSettledActiveIndex,
						})
					}
				>
					{strip.map((item, index) => {
						// The active slide's real content only takes over once its navigation has
						// settled; every other slide (including one mid-transition into becoming
						// active) shows the lighter-weight inactive content.
						const isSettledActive = index === activeIndex && index === settledActiveIndex;
						// Clone slides (buffer padding outside the real item range) repeat content
						// already elsewhere in the strip -- hidden from assistive tech so it isn't
						// announced multiple times.
						const isClone = index < startIndex || index >= startIndex + itemsLength;
						const { schemaIdentifier, dctermsFormat, backgroundColor } = item;

						return (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: strip repeats real elements, so schemaIdentifier alone isn't unique per slide
								key={`carousel-slide__${schemaIdentifier}__${index}`}
								onClick={() => handleGoToSlide(index)}
								aria-hidden={isClone ? true : undefined}
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
										item={item}
										onEnded={goNext}
										isLoading={isLoading}
									/>
								) : (
									<BlockHeroCarouselInactiveSlide item={item} isLoading={isLoading} />
								)}
							</div>
						);
					})}
				</div>
				<BlockHeroCarouselNavButtons
					className={'c-block-hero-carousel__carousel-navigation'}
					onPrev={goPrev}
					onNext={goNext}
				/>
			</div>
			<ObjectMetadata
				className={'c-block-hero-carousel__carousel-metadata'}
				ieObject={strip?.[activeIndex] as PlayableDisplayIeObject}
				fallbackTitle=""
			/>
		</div>
	);
};
