import clsx from 'clsx';
import React, { type FunctionComponent, type ReactElement, useState } from 'react';
import type SwiperController from 'swiper';
import { Controller } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { BlockHeading } from '~content-blocks/BlockHeading';
import { ImageCarouselSlide } from '~content-blocks/BlockImageCarousel/BlockImageCarouselSlide.tsx';
import { CarouselButtons } from '~modules/content-page/components/CarouselButtons/CarouselButtons.tsx';
import type {
	CopyrightComponentState,
	HeadingTypeOption,
} from '~modules/content-page/types/content-block.types';
import type { DefaultComponentProps } from '~modules/shared/types/components';

import './BlockImageCarousel.scss';

export interface BlockImageCarouselProps extends DefaultComponentProps {
	title: string;
	titleType: HeadingTypeOption;
	elements: ({
		image: string;
		imageAlt: string;
	} & CopyrightComponentState)[];
}

export const BlockImageCarousel: FunctionComponent<BlockImageCarouselProps> = ({
	title,
	titleType,
	elements,
}): ReactElement => {
	const [controlledSwiper, setControlledSwiper] = useState<SwiperController | null>(null);

	return (
		<div className={clsx('c-block-image-carousel')}>
			<div className={'c-block-image-carousel__header'}>
				<BlockHeading className={clsx('c-block-image-carousel__header-title')} type={titleType}>
					{title}
				</BlockHeading>

				<div className={'c-block-image-carousel__header-actions'}>
					<CarouselButtons controlledSwiper={controlledSwiper} />
				</div>
			</div>
			<Swiper
				modules={[Controller]}
				controller={{ control: controlledSwiper }}
				className={'c-block-image-carousel__wrapper'}
				slidesPerView="auto"
				spaceBetween={16}
				onSwiper={setControlledSwiper}
			>
				{elements.map((element, index) => (
					<SwiperSlide
						// biome-ignore lint/suspicious/noArrayIndexKey: No unique identifier possible
						key={`c-block-image-carousel-slide__${title}__${index}`}
						className="c-block-image-carousel__slide"
					>
						<ImageCarouselSlide title={title} {...element} />
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
};
