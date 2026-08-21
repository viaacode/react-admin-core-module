import { Image, Spinner } from '@viaa/avo2-components';
import clsx from 'clsx';
import React, { type FunctionComponent, type ReactElement } from 'react';
import type { HeroCarouselSlideItem } from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.types.ts';
import { IeObjectLoadError } from '~modules/content-page/components/IeObjectLoadError/IeObjectLoadError.tsx';
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
	item?: HeroCarouselSlideItem;
	isLoading?: boolean;
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
> = ({ item, isLoading }): ReactElement => {
	// The object behind this slide couldn't be resolved -- show that, rather than an empty slide.
	// Only the icon: the message is kept for the active slide, which has room for it.
	if (item?.hasFailed) {
		return (
			<IeObjectLoadError
				className="c-block-hero-carousel__carousel-slide-error"
				isTextVisible={false}
			/>
		);
	}

	const imageSrc = item?.videoThumbnail || item?.thumbnailUrl || '';

	// Nothing is known about this slide yet -- not even which object it points at, as with a freshly
	// added editor row that hasn't been filled in -- so the spinner is all there is to show.
	if (!item?.schemaIdentifier && !imageSrc && !item?.dctermsFormat) {
		return (
			<div className={clsx('c-block-hero-carousel__carousel-slide-placeholder')}>
				<Spinner size="large" locationId={'hero-carousel-slide'} />
			</div>
		);
	}

	// What the block config knows -- the format, the editor's thumbnail -- is shown right away; the
	// spinner sits on top of it until the rest of the object has been resolved.
	const loadingOverlay = isLoading ? (
		<div className="c-block-hero-carousel__carousel-slide-image-loading">
			<Spinner size="large" locationId={'hero-carousel-slide'} />
		</div>
	) : null;

	const imageClassName = clsx(
		'c-block-hero-carousel__carousel-slide-image',
		isLoading && 'c-block-hero-carousel__carousel-slide-image--loading'
	);

	const formatIcon = (
		<div
			className="c-block-hero-carousel__carousel-slide-image-format-icon"
			role="img"
			aria-label={getObjectTypeLabel(item?.dctermsFormat)}
		>
			<Icon name={getIconFromObjectType(item?.dctermsFormat, Boolean(item?.thumbnailUrl))} />
		</div>
	);

	if (!imageSrc) {
		return (
			<div className={imageClassName}>
				{formatIcon}
				{loadingOverlay}
			</div>
		);
	}

	return (
		<div className={imageClassName}>
			<Image
				src={imageSrc}
				alt={item?.name}
				className="c-block-hero-carousel__carousel-slide-image-media"
			/>
			{formatIcon}
			{loadingOverlay}
		</div>
	);
};
