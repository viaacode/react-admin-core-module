import { Button } from '@meemoo/react-components';
import { Image, LinkTarget } from '@viaa/avo2-components';
import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import clsx from 'clsx';
import React, { type FunctionComponent, type ReactNode, useState } from 'react';
import type SwiperController from 'swiper';
import { Controller } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useGetThemeWithObjects } from '~content-blocks/BlockThemeReels/hooks/useGetThemeWithObjects.ts';
import { AdminConfigManager } from '~core/config';
import { CarouselButtons } from '~modules/content-page/components/CarouselButtons/CarouselButtons.tsx';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import { App, Locale } from '~modules/translations/translations.core.types.ts';
import { Icon } from '~shared/components/Icon';
import { generateSmartLink } from '~shared/components/SmartLink/SmartLink.tsx';
import { getIconFromObjectType } from '~shared/helpers/get-icon-from-object-type.ts';
import type { ObjectType } from '~shared/helpers/map-format-to-type.ts';
import { isMobileWidth } from '~shared/helpers/media-query.ts';
import { tText } from '~shared/helpers/translation-functions.ts';

import 'swiper/css';
import './BlockThemeReelsSection.scss';

export interface BlockThemeReelSectionProps extends DefaultComponentProps {
	themeId: string;
	image?: string;
	imageAlt?: string;
	imageMask: string;
	description?: string;
}

export const BlockThemeReelSection: FunctionComponent<BlockThemeReelSectionProps> = ({
	themeId,
	image,
	imageAlt,
	imageMask,
	description,
}): ReactNode => {
	const { data: theme } = useGetThemeWithObjects(themeId);
	const locale = AdminConfigManager.getConfig().locale;

	const [controlledSwiper, setControlledSwiper] = useState<SwiperController | null>(null);

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
		className?: string,
		format?: ObjectType
	) => {
		return (
			<>
				{image ? (
					<Image
						src={image}
						alt={imageAlt || description}
						className={clsx('c-block-theme-reels-section__slide-image', className)}
						loading="lazy"
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
							icon={<Icon name={getIconFromObjectType(format, false)} />}
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
								label={tText(
									'modules/content-page/components/blocks/block-theme-reels/block-theme-reel-section___toon-alle',
									{},
									[App.HET_ARCHIEF]
								)}
								title={tText(
									'modules/content-page/components/blocks/block-theme-reels/block-theme-reel-section___toon-alle',
									{},
									[App.HET_ARCHIEF]
								)}
								ariaLabel={tText(
									'modules/content-page/components/blocks/block-theme-reels/block-theme-reel-section___toon-alle',
									{},
									[App.HET_ARCHIEF]
								)}
							/>,
							tText(
								'modules/content-page/components/blocks/block-theme-reels/block-theme-reel-section___toon-alle',
								{},
								[App.HET_ARCHIEF]
							),
							undefined,
							-1
						)}
					<CarouselButtons controlledSwiper={controlledSwiper} />
				</div>
			</div>
			<Swiper
				modules={[Controller]}
				controller={{ control: controlledSwiper }}
				className="c-block-theme-reels-section__wrapper"
				slidesPerView="auto"
				spaceBetween={16}
				onSwiper={setControlledSwiper}
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
							imageAlt || themeName,
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
						key={`theme-reel-slide__${theme.slug}__open-theme-cta`}
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
											{tText(
												'modules/content-page/components/blocks/block-theme-reels/block-theme-reel-section___toon-alle-materialen-voor-dit-theme',
												{},
												[App.HET_ARCHIEF]
											)}
										</span>
									</div>
								</>,
								tText(
									'modules/content-page/components/blocks/block-theme-reels/block-theme-reel-section___toon-alle-materialen-voor-dit-theme',
									{},
									[App.HET_ARCHIEF]
								),
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
