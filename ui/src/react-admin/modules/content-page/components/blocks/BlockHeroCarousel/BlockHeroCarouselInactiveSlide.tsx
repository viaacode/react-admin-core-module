import { Image, Spinner } from '@viaa/avo2-components';
import clsx from 'clsx';
import React, { type FunctionComponent, type ReactElement } from 'react';
import type { HeroCarouselSlideItem } from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.types.ts';
import type { DefaultComponentProps } from '~modules/shared/types/components';

export interface BlockHeroCarouselInactiveSlideProps extends DefaultComponentProps {
	item: HeroCarouselSlideItem;
	isLoading?: boolean;
}

export const BlockHeroCarouselInactiveSlide: FunctionComponent<
	BlockHeroCarouselInactiveSlideProps
> = ({ item, isLoading }): ReactElement => {
	if (isLoading) {
		return (
			<div className={clsx('c-block-hero-carousel__carousel-slide-placeholder')}>
				<Spinner size="large" locationId={'hero-carousel-slide'} />
			</div>
		);
	}

	const imageSrc = item.videoThumbnail || item.thumbnailUrl || '';

	if (!imageSrc) {
		return <div className={clsx('c-block-hero-carousel__carousel-slide-image')} />;
	}

	return (
		<Image
			src={imageSrc}
			alt={item.name}
			className={clsx('c-block-hero-carousel__carousel-slide-image')}
		/>
	);
};
