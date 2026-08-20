import { Button } from '@meemoo/react-components';
import { Image, Spinner } from '@viaa/avo2-components';
import clsx from 'clsx';
import React, { type FunctionComponent, type ReactElement, useState } from 'react';
import type { HeroCarouselSlideItem } from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.types.ts';
import { AdminCoreIconName } from '~core/config';
import { IeObjectFlowPlayerWrapper } from '~modules/content-page/components/IeObjectFlowPlayerWrapper/IeObjectFlowPlayerWrapper.tsx';
import { IeObjectLoadError } from '~modules/content-page/components/IeObjectLoadError/IeObjectLoadError.tsx';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import { Icon } from '~shared/components/Icon';
import { isAudioVideoFormat } from '~shared/helpers/is-audio-video-format.ts';
import { tText } from '~shared/helpers/translation-functions.ts';
import { HET_ARCHIEF } from '~shared/types';

export interface BlockHeroCarouselActiveSlideProps extends DefaultComponentProps {
	item?: HeroCarouselSlideItem;
	onEnded: () => void;
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

	// The object behind this slide couldn't be resolved -- show that, rather than an empty slide.
	if (item?.hasFailed) {
		return <IeObjectLoadError className="c-block-hero-carousel__carousel-slide-error" />;
	}

	if (isLoading || !item?.schemaIdentifier) {
		return (
			<div className={clsx('c-block-hero-carousel__carousel-slide-placeholder')}>
				<Spinner size="large" locationId={'hero-carousel-slide'} />
			</div>
		);
	}

	// The active slide is the only one big enough to warrant the full-size newspaper image, so
	// it's the only slide that prefers it over the (lower-res) thumbnail.
	const imageSrc = item.newspaperImage || item.videoThumbnail || item.thumbnailUrl || '';

	if (isAudioVideoFormat(item.dctermsFormat)) {
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
		return <div className={clsx('c-block-hero-carousel__carousel-slide-image')} />;
	}

	return (
		<div
			className={clsx(
				'c-block-hero-carousel__carousel-slide-image',
				'c-block-hero-carousel__carousel-slide-image--animated',
				isPaused && 'c-block-hero-carousel__carousel-slide-image--paused'
			)}
		>
			<Image
				src={imageSrc}
				alt={item.name}
				className="c-block-hero-carousel__carousel-slide-image-media"
			/>
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
