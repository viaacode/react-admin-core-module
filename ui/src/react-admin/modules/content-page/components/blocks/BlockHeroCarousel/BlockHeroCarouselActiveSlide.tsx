import { Button } from '@meemoo/react-components';
import { Image } from '@viaa/avo2-components';
import clsx from 'clsx';
import React, { type FunctionComponent, type ReactElement, useState } from 'react';
import type { HeroCarouselSlideItem } from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.types.ts';
import {
	getSlideImageSrc,
	isSlidePlayerReady,
} from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.utils.ts';
import { AdminCoreIconName } from '~core/config';
import { IeObjectFlowPlayerWrapper } from '~modules/content-page/components/IeObjectFlowPlayerWrapper/IeObjectFlowPlayerWrapper.tsx';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import { Icon } from '~shared/components/Icon';
import { tText } from '~shared/helpers/translation-functions.ts';
import { HET_ARCHIEF } from '~shared/types';

export interface BlockHeroCarouselActiveSlideProps extends DefaultComponentProps {
	item: HeroCarouselSlideItem;
	onEnded: () => void;
	/**
	 * The slide's object is still being resolved, so what shows is built from the block config
	 * alone. The carousel puts the spinner over it; here it only holds back this slide's timer.
	 */
	isLoading?: boolean;
	isMuted: boolean;
	onMutedChange: (muted: boolean) => void;
}

export const BlockHeroCarouselActiveSlide: FunctionComponent<BlockHeroCarouselActiveSlideProps> = ({
	item,
	onEnded,
	isLoading,
	isMuted,
	onMutedChange,
}): ReactElement => {
	const [isPaused, setIsPaused] = useState(false);

	const imageSrc = getSlideImageSrc(item, true);

	if (isSlidePlayerReady(item)) {
		return (
			<IeObjectFlowPlayerWrapper
				ieObject={item}
				autoplay={true}
				isMuted={isMuted}
				onMutedChange={onMutedChange}
				onEnded={onEnded}
				poster={imageSrc}
			/>
		);
	}

	if (!imageSrc) {
		return <div className="c-block-hero-carousel__carousel-slide-image" />;
	}

	return (
		<div
			className={clsx(
				'c-block-hero-carousel__carousel-slide-image',
				// The ken-burns animation doubles as this slide's timer -- its end advances the
				// carousel -- so it only runs once the slide shows its real content: a placeholder
				// shouldn't tick away while the object is still loading.
				!isLoading && 'c-block-hero-carousel__carousel-slide-image--animated',
				isPaused && 'c-block-hero-carousel__carousel-slide-image--paused'
			)}
		>
			<Image
				src={imageSrc}
				alt={item.name}
				className="c-block-hero-carousel__carousel-slide-image-media"
			/>
			{/* The progress bar is this slide's timer -- its end advances the carousel -- so it
			    only starts once the slide shows its real content. */}
			{!isLoading && (
				<div className="c-block-hero-carousel__carousel-slide-image-controls">
					<Button
						variants={['black', 'sm']}
						icon={<Icon name={isPaused ? AdminCoreIconName.Play : AdminCoreIconName.Pause} />}
						title={
							isPaused
								? tText(
										'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel-active-slide___afspelen',
										undefined,
										[HET_ARCHIEF]
									)
								: tText(
										'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel-active-slide___pauzeren',
										undefined,
										[HET_ARCHIEF]
									)
						}
						ariaLabel={
							isPaused
								? tText(
										'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel-active-slide___afspelen',
										undefined,
										[HET_ARCHIEF]
									)
								: tText(
										'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel-active-slide___pauzeren',
										undefined,
										[HET_ARCHIEF]
									)
						}
						onClick={() => setIsPaused((paused) => !paused)}
					/>
					<div className="c-block-hero-carousel__carousel-slide-image-progress" aria-hidden="true">
						<div className="c-block-hero-carousel__carousel-slide-image-progress-track">
							<div
								className="c-block-hero-carousel__carousel-slide-image-progress-fill"
								onAnimationEnd={onEnded}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
