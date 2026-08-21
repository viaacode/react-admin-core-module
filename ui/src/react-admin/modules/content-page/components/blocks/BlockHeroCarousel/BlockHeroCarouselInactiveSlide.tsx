import React, { type FunctionComponent, type ReactElement } from 'react';
import type { HeroCarouselSlideItem } from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.types.ts';
import { getSlideImageSrc } from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.utils.ts';
import { ImageOrAudioWaveForm } from '~modules/content-page/components/ImageOrAudioWaveForm/ImageOrAudioWaveForm.tsx';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import { Icon } from '~shared/components/Icon';
import { getIconFromObjectType } from '~shared/helpers/get-icon-from-object-type.ts';
import {
	type IeObjectType,
	mapDcTermsFormatToSimpleType,
	SimpleIeObjectType,
} from '~shared/helpers/map-format-to-type.ts';
import { tText } from '~shared/helpers/translation-functions.ts';
import { HET_ARCHIEF } from '~shared/types';

export interface BlockHeroCarouselInactiveSlideProps extends DefaultComponentProps {
	item: HeroCarouselSlideItem;
}

const getObjectTypeLabel = (format: IeObjectType | undefined): string => {
	const simpleType = mapDcTermsFormatToSimpleType(format);

	switch (simpleType) {
		case SimpleIeObjectType.VIDEO:
			return tText(
				'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel-inactive-slide___video',
				undefined,
				[HET_ARCHIEF]
			);

		case SimpleIeObjectType.AUDIO:
			return tText(
				'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel-inactive-slide___audio',
				undefined,
				[HET_ARCHIEF]
			);

		case SimpleIeObjectType.NEWSPAPER:
			return tText(
				'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel-inactive-slide___krant',
				undefined,
				[HET_ARCHIEF]
			);

		case SimpleIeObjectType.IMAGE:
			return tText(
				'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel-inactive-slide___afbeelding',
				undefined,
				[HET_ARCHIEF]
			);

		default:
			return tText(
				'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel-inactive-slide___bestand',
				undefined,
				[HET_ARCHIEF]
			);
	}
};

export const BlockHeroCarouselInactiveSlide: FunctionComponent<
	BlockHeroCarouselInactiveSlideProps
> = ({ item }): ReactElement => {
	const imageSrc = getSlideImageSrc(item);

	const formatIcon = (
		<div
			className="c-block-hero-carousel__carousel-slide-image-format-icon"
			role="img"
			aria-label={getObjectTypeLabel(item.dctermsFormat)}
		>
			<Icon name={getIconFromObjectType(item.dctermsFormat, Boolean(item.thumbnailUrl))} />
		</div>
	);

	return (
		<div className="c-block-hero-carousel__carousel-slide-image">
			<ImageOrAudioWaveForm
				imageSrc={imageSrc}
				imageAlt={item.name}
				backgroundColor={item.backgroundColor}
				className="c-block-hero-carousel__carousel-slide-image-media"
			/>
			{formatIcon}
		</div>
	);
};
