import { type ButtonAction, Image } from '@viaa/avo2-components';
import React, { type FunctionComponent, type ReactElement, useEffect, useState } from 'react';
import type { Color, HeadingTypeOption } from '~modules/content-page/types/content-block.types';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import './BlockOverviewWithCarousel.scss';
import { Button } from '@meemoo/react-components';
import type SwiperController from 'swiper';
import { Controller } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Icon } from '~shared/components/Icon';
import { tText } from '~shared/helpers/translation-functions.ts';
import 'swiper/css';
import clsx from 'clsx';
import { BlockHeading } from '~content-blocks/BlockHeading';
import { generateSmartLink } from '~shared/components/SmartLink/SmartLink.tsx';

export interface BlockOverviewWithCarouselProps extends DefaultComponentProps {
	backgroundColor: string;
	title: string;
	titleType: HeadingTypeOption;
	buttonLabel: string;
	buttonAltTitle?: string;
	buttonAction?: ButtonAction;
	elements: {
		mediaItem: ButtonAction;
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
	const [showPrevSlideButton, setShowPrevSlideButton] = useState<boolean>(false);
	const [showNextSlideButton, setShowNextSlideButton] = useState<boolean>(false);

	const updateSlideButtons = () => {
		setShowPrevSlideButton(controlledSwiper ? !controlledSwiper.isBeginning : false);
		setShowNextSlideButton(controlledSwiper ? !controlledSwiper.isEnd : false);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: Only used to init the buttons
	useEffect(() => {
		if (controlledSwiper) {
			updateSlideButtons();
		}
	}, [controlledSwiper]);

	const renderSlideContent = (
		image: string,
		imageAlt: string,
		title: string,
		backgroundColor: Color
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
					<span className={'c-block-overview-with-carousel__slide-text'}>{title}</span>
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
					<div className={'c-block-overview-with-carousel__header-nav'}>
						{showPrevSlideButton && (
							<Button
								variants={['black', 'sm']}
								icon={<Icon name="arrowLeft" />}
								title={tText('Vorige slide')}
								ariaLabel={tText('Vorige slide')}
								onClick={() => controlledSwiper?.slidePrev()}
							/>
						)}
						{showNextSlideButton && (
							<Button
								variants={['black', 'sm']}
								icon={<Icon name="arrowRight" />}
								title={tText('Volgende slide')}
								ariaLabel={tText('Volgende slide')}
								onClick={() => controlledSwiper?.slideNext()}
							/>
						)}
					</div>
				</div>
			</div>
			<Swiper
				modules={[Controller]}
				controller={{ control: controlledSwiper }}
				className={'c-block-overview-with-carousel__wrapper'}
				slidesPerView="auto"
				spaceBetween={16}
				onSwiper={setControlledSwiper}
				onTransitionEnd={() => updateSlideButtons()}
				watchSlidesProgress={true}
			>
				{elements.map(
					({ title, image, imageAlt, itemDisplay, textColor, backgroundColor, mediaItem }) => {
						const componentClassName = clsx(
							'c-block-overview-with-carousel__slide',
							itemDisplay === '9:16' && `c-block-overview-with-carousel__slide__portrait`,
							itemDisplay === '9:16round' && `c-block-overview-with-carousel__slide__round`,
							itemDisplay === '16:9' && `c-block-overview-with-carousel__slide__landscape`
						);
						return (
							<SwiperSlide
								key={`carousel-slide__${title}__${mediaItem.type}__${mediaItem.value}`}
								className={componentClassName}
								style={{
									backgroundColor: backgroundColor,
									color: textColor,
								}}
							>
								{({ isVisible }) => {
									return generateSmartLink(
										mediaItem,
										renderSlideContent(image, imageAlt, title, backgroundColor),
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
