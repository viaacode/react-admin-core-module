import { type IconName, Image, LinkTarget } from '@viaa/avo2-components';
import React, { type FunctionComponent, type ReactNode, useEffect, useState } from 'react';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import './BlockThemeReelsSection.scss';
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
import { isMobileWidth } from '~shared/helpers/media-query.ts';

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

	const getIconFromObjectType = (format: string | undefined): string => {
		switch (format) {
			case 'film':
			case 'video':
			case 'videofragment':
				return 'no-video--light';

			case 'audio':
			case 'audiofragment':
				return 'no-audio--light';

			case 'newspaper':
			case 'newspaperpage':
				return 'no-newspaper--light';

			case 'image':
				return 'no-image--light';

			default:
				return 'no-file--light';
		}
	};

	const renderSlideContent = (
		image: string,
		imageAlt: string,
		title: string,
		description: string,
		className?: string,
		format?: string
	) => {
		return (
			<>
				{image ? (
					<Image
						src={image}
						alt={imageAlt || description}
						className={clsx('c-block-theme-reels-section__slide-image', className)}
					/>
				) : (
					<div
						className={clsx(
							'c-block-theme-reels-section__slide-image',
							'c-block-theme-reels-section__slide-image-placeholder',
							className
						)}
						aria-hidden
					>
						<Button
							className="c-block-theme-reels-section__slide-image-placeholder-icon"
							variants={['sm', 'block']}
							icon={<Icon name={getIconFromObjectType(format) as IconName} />}
							disabled
							tabIndex={-1}
						/>
					</div>
				)}
				<div className="c-block-theme-reels-section__slide-description">
					{title && (
						<span className="c-block-theme-reels-section__slide-description-title">{title}</span>
					)}
					{description && (
						<span className="c-block-theme-reels-section__slide-description-text">
							{description}
						</span>
					)}
				</div>
			</>
		);
	};

	return (
		<div className={clsx('c-block-theme-reels-section')}>
			<div className="c-block-theme-reels-section__header">
				<span className="c-block-theme-reels-section__header-title">{themeName}</span>
				{isMobileWidth() && (description || themeDescription) && (
					<span className="c-block-theme-reels-section__header-subtitle">
						{description || themeDescription || ''}
					</span>
				)}
				<div className="c-block-theme-reels-section__header-actions">
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
					<div className="c-block-theme-reels-section__header-nav">
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
				className="c-block-theme-reels-section__wrapper"
				slidesPerView="auto"
				spaceBetween={16}
				onSwiper={setControlledSwiper}
				onTransitionEnd={() => updateSlideButtons()}
				watchSlidesProgress={true}
			>
				{!isMobileWidth() && (
					<SwiperSlide
						key={`theme-reel-slide__${theme.slug}__start-image`}
						className={clsx(
							'c-block-theme-reels-section__slide',
							'c-block-theme-reels-section__slide--first'
						)}
						title={description || themeDescription || ''}
					>
						{renderSlideContent(
							image || theme.imageUrl,
							imageAltText || themeName,
							'',
							description || themeDescription || '',
							clsx(`c-block-theme-reels-section__slide-image--mask-${imageMask}`)
						)}
					</SwiperSlide>
				)}
				{theme.ieObjects.map(
					({ id, format, maintainerName, schemaIdentifier, thumbnailUrl, name }) => {
						const componentClassName = clsx('c-block-theme-reels-section__slide');
						return (
							<SwiperSlide
								key={`theme-reel-slide__${theme.slug}__${id}}`}
								className={componentClassName}
							>
								{({ isVisible }) => {
									return generateSmartLink(
										{
											type: AvoCoreContentPickerType.INTERNAL_LINK,
											target: LinkTarget.Self,
											value: `/pid/${schemaIdentifier}`,
										},
										renderSlideContent(
											thumbnailUrl,
											name,
											name,
											maintainerName,
											`c-block-theme-reels-section__slide-image--format-${format}`,
											format
										),
										name,
										componentClassName,
										isVisible ? undefined : -1
									);
								}}
							</SwiperSlide>
						);
					}
				)}
				{themeContentPagePath && (
					<SwiperSlide
						key={`theme-reel-slide__${theme.slug}__start-image`}
						className={clsx(
							'c-block-theme-reels-section__slide',
							'c-block-theme-reels-section__slide--last'
						)}
					>
						{({ isVisible }) => {
							return generateSmartLink(
								{
									value: themeContentPagePath,
									type: AvoCoreContentPickerType.CONTENT_PAGE,
									target: LinkTarget.Self,
								},
								<>
									<div
										className={clsx(
											'c-block-theme-reels-section__slide-image',
											'c-block-theme-reels-section__slide-image-placeholder'
										)}
										aria-hidden
									>
										<Button
											variants={['black', 'sm', 'block']}
											icon={<Icon name="add" />}
											disabled
											tabIndex={-1}
										/>
									</div>
									<div className="c-block-theme-reels-section__slide-description">
										<span className="c-block-theme-reels-section__slide-description-title">
											{tText('Toon alle materialen voor dit theme', {}, [App.HET_ARCHIEF])}
										</span>
									</div>
								</>,
								tText('Toon alle materialen voor dit theme', {}, [App.HET_ARCHIEF]),
								'c-block-theme-reels-section__slide',
								isVisible ? undefined : -1
							);
						}}
					</SwiperSlide>
				)}
			</Swiper>
		</div>
	);
};
