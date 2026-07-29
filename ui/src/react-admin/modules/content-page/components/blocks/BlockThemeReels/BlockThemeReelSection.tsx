import { Image, LinkTarget } from '@viaa/avo2-components';
import React, { type FunctionComponent, type ReactNode, useEffect, useState } from 'react';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import './BlockThemeReels.scss';
import { Button } from '@meemoo/react-components';
import type SwiperController from 'swiper';
import { Controller } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Icon } from '~shared/components/Icon';
import { tText } from '~shared/helpers/translation-functions.ts';
import 'swiper/css';
import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import clsx from 'clsx';
import { useGetThemeWithObjects } from '~content-blocks/BlockThemeReels/hooks/useGetThemeWithObjects.ts';
import { AdminConfigManager } from '~core/config';
import { App, Locale } from '~modules/translations/translations.core.types.ts';
import { generateSmartLink } from '~shared/components/SmartLink/SmartLink.tsx';

export interface BlockThemeReelSectionProps extends DefaultComponentProps {
	themeId: string;
	image?: string;
	imageAltText?: string;
	imageMask: string;
	description?: string;
}

export const BlockThemeReelSection: FunctionComponent<BlockThemeReelSectionProps> = ({
	themeId,
	image,
	imageAltText,
	imageMask,
	description,
}): ReactNode => {
	const { data: theme } = useGetThemeWithObjects(themeId);
	const locale = AdminConfigManager.getConfig().locale;

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
			// eslint-disable-next-line react-hooks/set-state-in-effect
			updateSlideButtons();
		}
	}, [controlledSwiper]);

	if (!theme) {
		return null;
	}

	const themeName = locale === Locale.En ? theme.nameEn : theme.nameNl;
	const themeDescription = locale === Locale.En ? theme.descriptionEn : theme.descriptionNl;
	const themeContentPagePath =
		locale === Locale.En ? theme.contentPagePathEn : theme.contentPagePathNl;

	const renderSlideContent = (
		image: string,
		imageAlt: string,
		title: string,
		description: string,
		className?: string
	) => {
		return (
			<>
				<Image
					src={image || theme.imageUrl || ''}
					alt={imageAlt || description}
					className={clsx('c-block-theme-reels__slide-image', className)}
				/>
				<div className="c-block-theme-reels__slide-description">
					{title && <span className="c-block-theme-reels__slide-description-title">{title}</span>}
					{description && (
						<span className="c-block-theme-reels__slide-description-text">{description}</span>
					)}
				</div>
			</>
		);
	};

	return (
		<div className={clsx('c-block-theme-reels')}>
			<div className="c-block-theme-reels__header">
				<span className={clsx('c-block-overview-with-carousel__header-title')}>{themeName}</span>
				<div className="c-block-theme-reels__header-actions">
					{themeContentPagePath &&
						generateSmartLink(
							{
								value: themeContentPagePath,
								type: AvoCoreContentPickerType.CONTENT_PAGE,
								target: LinkTarget.Self,
							},
							<Button
								variants={['inline-block', 'silver', 'sm']}
								label={tText('Toon alle', {}, [App.HET_ARCHIEF])}
								title={tText('Toon alle', {}, [App.HET_ARCHIEF])}
								ariaLabel={tText('Toon alle', {}, [App.HET_ARCHIEF])}
							/>,
							tText('Toon alle', {}, [App.HET_ARCHIEF]),
							undefined,
							-1
						)}
					<div className="c-block-theme-reels__header-nav">
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
				className="c-block-theme-reels__wrapper"
				slidesPerView="auto"
				spaceBetween={16}
				onSwiper={setControlledSwiper}
				onTransitionEnd={() => updateSlideButtons()}
				watchSlidesProgress={true}
			>
				<SwiperSlide
					key={`carousel-slide__${theme.slug}__start-image`}
					className="c-block-theme-reels__slide--first"
				>
					{renderSlideContent(
						image || theme.imageUrl,
						imageAltText || themeName,
						'',
						description || themeDescription || '',
						clsx(`c-block-theme-reels__slide-image--mask-${imageMask}`)
					)}
				</SwiperSlide>
				{theme.ieObjects.map(({ id, format, maintainerName, maintainerId, thumbnailUrl, name }) => {
					const componentClassName = clsx('c-block-theme-reels__slide');
					return (
						<SwiperSlide
							key={`carousel-slide__${theme.slug}__${id}}`}
							className={componentClassName}
						>
							{renderSlideContent(thumbnailUrl, name, name, maintainerName)}
						</SwiperSlide>
					);
				})}
			</Swiper>
		</div>
	);
};
