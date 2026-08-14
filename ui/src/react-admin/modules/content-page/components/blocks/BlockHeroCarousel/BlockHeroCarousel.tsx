import React, { type CSSProperties, type FunctionComponent, type ReactNode, useMemo } from 'react';
import type { Color } from '~modules/content-page/types/content-block.types';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import './BlockHeroCarousel.scss';
import 'swiper/css';
import clsx from 'clsx';
import type { HeroCarouselBlockComponentState } from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.types.ts';
import {
	BlockHeroCarouselCarousel,
	type HeroCarouselSlideItem,
} from '~content-blocks/BlockHeroCarousel/BlockHeroCarouselCarousel.tsx';
import { BlockHeroCarouselSearch } from '~content-blocks/BlockHeroCarousel/BlockHeroCarouselSearch.tsx';
import { useGetIeObjectsByIds } from '~content-blocks/BlockHeroCarousel/hooks/useGetIeObjectsByIds.ts';
import type { ObjectType } from '~shared/helpers/mapFormatToType.ts';

export interface BlockHeroCarouselProps extends DefaultComponentProps {
	backgroundColor: Color;
	backgroundImage?: string;
	title: string;
	searchAriaLabel: string;
	subtitles: { label: string }[];
	elements: HeroCarouselBlockComponentState[];
}

export const BlockHeroCarousel: FunctionComponent<BlockHeroCarouselProps> = ({
	className,
	backgroundImage,
	title,
	subtitles,
	searchAriaLabel,
	elements,
}): ReactNode => {
	const { data: ieObjects, isLoading } = useGetIeObjectsByIds(elements);

	// Placeholders keep every slide's format-based width correct while the ie-objects are
	// still loading, since that format is already known from the content picker selection.
	const carouselElements = useMemo<HeroCarouselSlideItem[]>(() => {
		if (ieObjects) {
			return ieObjects;
		}
		return elements
			.filter((element) => !!element.mediaItem)
			.map((element) => ({
				...element,
				schemaIdentifier: String(element.mediaItem?.value),
				dctermsFormat: element.mediaItem?.dctermsFormat as ObjectType,
			}));
	}, [ieObjects, elements]);

	return (
		<article className={clsx('c-block-hero-carousel', className)}>
			{backgroundImage && (
				<div
					className={clsx('c-block-hero-carousel__background')}
					style={
						{
							backgroundImage: `url(${backgroundImage})`,
						} as CSSProperties
					}
				/>
			)}
			<BlockHeroCarouselSearch
				title={title}
				subtitles={subtitles}
				searchAriaLabel={searchAriaLabel}
			/>
			{carouselElements.length > 0 && (
				<BlockHeroCarouselCarousel elements={carouselElements} isLoading={isLoading} />
			)}
		</article>
	);
};
