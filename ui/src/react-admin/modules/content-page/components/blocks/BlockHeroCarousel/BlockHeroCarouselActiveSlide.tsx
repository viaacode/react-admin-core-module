import { Image, Spinner } from '@viaa/avo2-components';
import clsx from 'clsx';
import React, { type FunctionComponent, type ReactElement, useMemo } from 'react';
import type { HeroCarouselSlideItem } from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.types.ts';
import type { DefaultComponentProps } from '~modules/shared/types/components';

export interface BlockHeroCarouselActiveSlideProps
	extends DefaultComponentProps,
		Pick<
			HeroCarouselSlideItem,
			'schemaIdentifier' | 'name' | 'thumbnailUrl' | 'newspaperImage' | 'videoThumbnail'
		> {
	isLoading?: boolean;
}

export const BlockHeroCarouselActiveSlide: FunctionComponent<BlockHeroCarouselActiveSlideProps> = ({
	schemaIdentifier,
	name,
	thumbnailUrl,
	newspaperImage,
	videoThumbnail,
	isLoading,
}): ReactElement => {
	if (isLoading) {
		return (
			<div className={clsx('c-block-hero-carousel__carousel-slide-placeholder')}>
				<Spinner size="large" locationId={`hero-carousel-slide__${schemaIdentifier}`} />
			</div>
		);
	}

	// The active slide is the only one big enough to warrant the full-size newspaper image, so
	// it's the only slide that prefers it over the (lower-res) thumbnail.
	const imageSrc = newspaperImage || videoThumbnail || thumbnailUrl || '';

	if (!imageSrc) {
		return <div className={clsx('c-block-hero-carousel__carousel-slide-image')} />;
	}

	return (
		<Image
			src={imageSrc}
			alt={name}
			className={clsx('c-block-hero-carousel__carousel-slide-image')}
		/>
	);
};
