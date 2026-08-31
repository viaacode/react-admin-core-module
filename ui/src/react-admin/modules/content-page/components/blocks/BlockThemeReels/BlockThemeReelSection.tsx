import { Button } from '@meemoo/react-components';
import { LinkTarget } from '@viaa/avo2-components';
import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import clsx from 'clsx';
import React, { type FunctionComponent, type ReactNode, useMemo, useState } from 'react';
import type SwiperController from 'swiper';
import { Controller } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useGetThemeWithObjects } from '~content-blocks/BlockThemeReels/hooks/useGetThemeWithObjects.ts';
import { AdminConfigManager } from '~core/config';
import { AdminCoreIconName } from '~core/config/config.types';
import { CarouselButtons } from '~modules/content-page/components/CarouselButtons/CarouselButtons.tsx';
import { ImageOrAudioWaveForm } from '~modules/content-page/components/ImageOrAudioWaveForm/ImageOrAudioWaveForm.tsx';
import { getRandomTertiaryBackgroundColor } from '~modules/content-page/helpers/get-random-tertiary-background-color.ts';
import type { Color } from '~modules/content-page/types/content-block.types.ts';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import { App, Locale } from '~modules/translations/translations.core.types.ts';
import { Icon } from '~shared/components/Icon';
import { generateSmartLink } from '~shared/components/SmartLink/SmartLink.tsx';
import { getIconFromObjectType } from '~shared/helpers/get-icon-from-object-type.ts';
import type { IeObjectType } from '~shared/helpers/map-format-to-type.ts';
import { isMobileWidth } from '~shared/helpers/media-query.ts';
import { tText } from '~shared/helpers/translation-functions.ts';

import 'swiper/css';
import './BlockThemeReelsSection.scss';
import { IeObjectsService } from '~modules/ie-objects/ie-objects.service.ts';

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

	// The "open this theme" tile has no image, it gets one of the tertiary brand colors instead.
	// Picked once per mount so it stays stable while the carousel is scrolled.
	const ctaBackgroundColor = useMemo(() => getRandomTertiaryBackgroundColor(), []);

	// Each object tile gets its own random tertiary color for its wave form background, picked
	// once when the theme's objects come in so it stays stable while the carousel is scrolled.
	// One color per position (matched up by index below) rather than a map keyed by object id:
	// the same object can in principle appear more than once, which an id-keyed map would
	// collapse into a shared color.
	const objectBackgroundColors = useMemo(
		() => (theme?.ieObjects ?? []).map(() => getRandomTertiaryBackgroundColor()),
		[theme?.ieObjects]
	);

	if (!theme) {
		return null;
	}

	const themeName = locale === Locale.En ? theme.nameEn : theme.nameNl;
	const themeDescription = locale === Locale.En ? theme.descriptionEn : theme.descriptionNl;
	const themeContentPagePath =
		locale === Locale.En ? theme.contentPagePathEn : theme.contentPagePathNl;
	// The proxy sometimes omits the total ie-object count. Fall back to the plain CTA rather than
	// rendering a "Toon alle undefined materialen" label.
	const ctaLabel = theme.total
		? tText(
				'modules/content-page/components/blocks/block-theme-reels/block-theme-reel-section___toon-alle-count-materialen',
				{ count: String(theme.total) },
				[App.HET_ARCHIEF]
			)
		: tText(
				'modules/content-page/components/blocks/block-theme-reels/block-theme-reel-section___toon-alle',
				{},
				[App.HET_ARCHIEF]
			);

	const renderSlideContent = (
		image: string,
		imageAlt: string,
		title: string,
		description: string,
		className?: string,
		format?: IeObjectType,
		backgroundColor: Color = ctaBackgroundColor
	) => {
		return (
			<>
				{image ? (
					<ImageOrAudioWaveForm
						imageSrc={image}
						imageAlt={imageAlt || description}
						backgroundColor={backgroundColor}
						size="large"
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
							icon={<Icon name={getIconFromObjectType(format, false)} />}
							disabled
							tabIndex={-1}
						/>
					</div>
				)}
				<div className="c-block-theme-reels-section__slide-description">
					{title && (
						<span className="c-block-theme-reels-section__slide-description-title u-background-text-primary">
							{title}
						</span>
					)}
					{description && (
						<span className="c-block-theme-reels-section__slide-description-text u-background-text-secondary">
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
				<span className="c-block-theme-reels-section__header-title u-background-text-primary">
					{themeName}
				</span>
				{isMobileWidth() && (description || themeDescription) && (
					<span className="c-block-theme-reels-section__header-subtitle u-background-text-secondary">
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
					(
						{ id, format, maintainerSlug, maintainerName, schemaIdentifier, thumbnailUrl, name },
						index
					) => {
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
											value: IeObjectsService.getObjectDetailPath(
												maintainerSlug,
												schemaIdentifier,
												name
											),
										},
										renderSlideContent(
											thumbnailUrl,
											name,
											name,
											maintainerName,
											`c-block-theme-reels-section__slide-image--format-${format}`,
											format,
											objectBackgroundColors[index]
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
								<div
									className="c-block-theme-reels-section__cta"
									style={{ backgroundColor: ctaBackgroundColor }}
								>
									<span className="c-block-theme-reels-section__cta-label">{ctaLabel}</span>
									<span className="c-block-theme-reels-section__cta-icons" aria-hidden>
										<Icon name={AdminCoreIconName.Collection} />
										<Icon name={AdminCoreIconName.ArrowDownRight} />
									</span>
								</div>,
								ctaLabel,
								clsx(
									'c-block-theme-reels-section__slide',
									'c-block-theme-reels-section__slide--last'
								),
								isVisible ? undefined : -1
							);
						}}
					</SwiperSlide>
				)}
			</Swiper>
		</div>
	);
};
