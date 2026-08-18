import { Image, Spinner } from '@viaa/avo2-components';
import clsx from 'clsx';
import React, { type FunctionComponent, type ReactElement } from 'react';
import type { HeroCarouselSlideItem } from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.types.ts';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import { Icon } from '~shared/components/Icon';
import { getIconFromObjectType } from '~shared/helpers/get-icon-from-object-type.ts';
import {
	mapDcTermsFormatToSimpleType,
	type ObjectType,
	SimpleIeObjectType,
} from '~shared/helpers/map-format-to-type.ts';
import { tText } from '~shared/helpers/translation-functions.ts';
import { HET_ARCHIEF } from '~shared/types';

export interface BlockHeroCarouselInactiveSlideProps extends DefaultComponentProps {
	item?: HeroCarouselSlideItem;
	isLoading?: boolean;
}

const getObjectTypeLabel = (format: ObjectType | undefined): string => {
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
> = ({ item, isLoading }): ReactElement => {
	if (isLoading || !item?.schemaIdentifier) {
		return (
			<div className={clsx('c-block-hero-carousel__carousel-slide-placeholder')}>
				<Spinner size="large" locationId={'hero-carousel-slide'} />
			</div>
		);
	}

	const imageSrc = item.videoThumbnail || item.thumbnailUrl || '';

	const formatIcon = (
		<div
			className="c-block-hero-carousel__carousel-slide-image-format-icon"
			role="img"
			aria-label={getObjectTypeLabel(item.dctermsFormat)}
		>
			<Icon name={getIconFromObjectType(item.dctermsFormat, Boolean(item.thumbnailUrl))} />
		</div>
	);

	if (!imageSrc) {
		return <div className={clsx('c-block-hero-carousel__carousel-slide-image')}>{formatIcon}</div>;
	}

	return (
		<div className={clsx('c-block-hero-carousel__carousel-slide-image')}>
			<Image
				src={imageSrc}
				alt={item.name}
				className="c-block-hero-carousel__carousel-slide-image-media"
			/>
			{formatIcon}
		</div>
	);
};
