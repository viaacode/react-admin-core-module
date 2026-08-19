import { Button } from '@meemoo/react-components';
import { type ButtonAction, Image } from '@viaa/avo2-components';
import React, { type FunctionComponent, type ReactElement, useState } from 'react';
import type SwiperController from 'swiper';
import { Controller } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import clsx from 'clsx';
import { BlockHeading } from '~content-blocks/BlockHeading';
import { CarouselButtons } from '~modules/content-page/components/CarouselButtons/CarouselButtons.tsx';
import type { Color, HeadingTypeOption } from '~modules/content-page/types/content-block.types';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import { generateSmartLink } from '~shared/components/SmartLink/SmartLink.tsx';

import 'swiper/css';
import './BlockOverviewWithCarousel.scss';

export interface BlockOverviewWithCarouselProps extends DefaultComponentProps {
	backgroundColor: string;
	title: string;
	titleType: HeadingTypeOption;
	buttonLabel: string;
	buttonAltTitle?: string;
	buttonAction?: ButtonAction;
	elements: {
		mediaItem?: ButtonAction;
		image: string;
		imageAlt: string;
		title: string;
		textColor: Color;
		backgroundColor: Color;
		itemDisplay: string;
	}[];
}

export const BlockOverviewWithCarousel: FunctionComponent<BlockOverviewWithCarouselProps> = ({
	backgroundColor,
	title,
	titleType,
	buttonLabel,
	buttonAltTitle,
	buttonAction,
	elements,
}): ReactElement => {
	const [controlledSwiper, setControlledSwiper] = useState<SwiperController | null>(null);

	const renderSlideContent = (
		image: string,
		imageAlt: string,
		title: string,
		backgroundColor: Color,
		textColor: Color
	) => {
		return (
			<>
				<Image
					src={image}
					alt={imageAlt || title}
					className={clsx('c-block-overview-with-carousel__slide-image')}
				/>
				<div
					className={'c-block-overview-with-carousel__slide-description'}
					style={{
						backgroundColor: backgroundColor,
					}}
				>
					<span
						className={'c-block-overview-with-carousel__slide-text'}
						style={{
							color: textColor,
						}}
					>
						{title}
					</span>
				</div>
			</>
		);
	};

	return (
		<div
			className={clsx('c-block-overview-with-carousel')}
			style={{
				backgroundColor: backgroundColor,
			}}
		>
			<div className={'c-block-overview-with-carousel__header'}>
				<BlockHeading
					className={clsx('c-block-overview-with-carousel__header-title')}
					type={titleType}
				>
					{title}
				</BlockHeading>

				<div className={'c-block-overview-with-carousel__header-actions'}>
					{buttonAction &&
						generateSmartLink(
							buttonAction,
							<Button
								variants={['inline-block', 'silver', 'sm']}
								label={buttonLabel}
								title={buttonAltTitle}
								ariaLabel={buttonAltTitle}
							/>,
							buttonAltTitle || buttonLabel,
							undefined,
							-1
						)}
					<CarouselButtons controlledSwiper={controlledSwiper} />
				</div>
			</div>
			<Swiper
				modules={[Controller]}
				controller={{ control: controlledSwiper }}
				className={'c-block-overview-with-carousel__wrapper'}
				slidesPerView="auto"
				spaceBetween={16}
				onSwiper={setControlledSwiper}
				watchSlidesProgress={true}
			>
				{elements.map(
					({ title, image, imageAlt, itemDisplay, textColor, backgroundColor, mediaItem }) => {
						const componentClassName = clsx(
							'c-block-overview-with-carousel__slide',
							itemDisplay === '9:16' && 'c-block-overview-with-carousel__slide__portrait',
							itemDisplay === '9:16round' && 'c-block-overview-with-carousel__slide__round',
							itemDisplay === '16:9' && 'c-block-overview-with-carousel__slide__landscape'
						);
						return (
							<SwiperSlide
								key={`carousel-slide__${title}__${mediaItem?.type}__${mediaItem?.value}`}
								className={componentClassName}
								style={{
									backgroundColor: backgroundColor,
								}}
							>
								{({ isVisible }) => {
									return generateSmartLink(
										mediaItem,
										renderSlideContent(image, imageAlt, title, backgroundColor, textColor),
										title,
										componentClassName,
										isVisible ? undefined : -1
									);
								}}
							</SwiperSlide>
						);
					}
				)}
			</Swiper>
		</div>
	);
};
