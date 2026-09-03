import { Button } from '@meemoo/react-components';
import { Image } from '@viaa/avo2-components';
import clsx from 'clsx';
import React, { type FunctionComponent, type ReactElement, type ReactNode, useState } from 'react';
import type { HeroCarouselSlideItem } from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.types.ts';
import {
	getSlideImageSrc,
	isSlidePlayerReady,
} from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.utils.ts';
import { BlockHeroCarouselInaccessibleItem } from '~content-blocks/BlockHeroCarousel/BlockHeroCarouselInaccessibleItem.tsx';
import { AdminCoreIconName } from '~core/config';
import { IeObjectFlowPlayerWrapper } from '~modules/content-page/components/IeObjectFlowPlayerWrapper/IeObjectFlowPlayerWrapper.tsx';
import { IeObjectLoadError } from '~modules/content-page/components/IeObjectLoadError';
import { Color } from '~modules/content-page/types/content-block.types.ts';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import { Icon } from '~shared/components/Icon';
import { tText } from '~shared/helpers/translation-functions.ts';
import { HET_ARCHIEF } from '~shared/types';

export interface BlockHeroCarouselActiveSlideProps extends DefaultComponentProps {
	item: HeroCarouselSlideItem;
	onEnded: () => void;
	isMuted: boolean;
	onMutedChange: (muted: boolean) => void;
}

export const BlockHeroCarouselActiveSlide: FunctionComponent<BlockHeroCarouselActiveSlideProps> = ({
	item,
	onEnded,
	isMuted,
	onMutedChange,
}): ReactElement => {
	const [isPaused, setIsPaused] = useState(false);

	const imageSrc = getSlideImageSrc(item, true);

	const renderAnimationWrapper = (content: ReactNode) => {
		return (
			<div
				className={clsx(
					'c-block-hero-carousel__carousel-slide-image',
					'c-block-hero-carousel__carousel-slide-image--animated',
					isPaused && 'c-block-hero-carousel__carousel-slide-image--paused'
				)}
			>
				{content}
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
			</div>
		);
	};

	if (item?.hasFailed) {
		return renderAnimationWrapper(
			<IeObjectLoadError className="c-block-hero-carousel__carousel-slide-error" isTextVisible />
		);
	}

	if (!item?.isAccessible || !imageSrc) {
		return renderAnimationWrapper(<BlockHeroCarouselInaccessibleItem item={item} />);
	}

	if (isSlidePlayerReady(item)) {
		return (
			<IeObjectFlowPlayerWrapper
				ieObject={item}
				autoplay={true}
				isMuted={isMuted}
				onMutedChange={onMutedChange}
				onEnded={onEnded}
				poster={imageSrc}
				backgroundColor={item?.backgroundColor}
			/>
		);
	}

	return renderAnimationWrapper(
		<Image
			src={imageSrc}
			alt={item.name}
			className="c-block-hero-carousel__carousel-slide-image-media"
		/>
	);
};
