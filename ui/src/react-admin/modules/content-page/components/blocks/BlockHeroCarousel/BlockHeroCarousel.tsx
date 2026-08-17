import React, { type CSSProperties, type FunctionComponent, type ReactNode, useMemo } from 'react';
import type { Color } from '~modules/content-page/types/content-block.types';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import './BlockHeroCarousel.scss';
import 'swiper/css';
import clsx from 'clsx';
import type {
	HeroCarouselBlockComponentState,
	HeroCarouselSlideItem,
} from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.types.ts';
import { BlockHeroCarouselCarousel } from '~content-blocks/BlockHeroCarousel/BlockHeroCarouselCarousel.tsx';
import { BlockHeroCarouselSearch } from '~content-blocks/BlockHeroCarousel/BlockHeroCarouselSearch.tsx';
import { useGetIeObjectsByIds } from '~content-blocks/BlockHeroCarousel/hooks/useGetIeObjectsByIds.ts';
import { GET_TERTIARY_BACKGROUND_COLOR_OPTIONS_ARCHIEF } from '~modules/content-page/const/get-color-options.ts';
import type { ObjectType } from '~shared/helpers/map-format-to-type.ts';
import { toSeconds } from '~shared/helpers/parsers/duration.ts';

export interface BlockHeroCarouselProps extends DefaultComponentProps {
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
	const items = useMemo(() => {
		const allTertiaryColors = GET_TERTIARY_BACKGROUND_COLOR_OPTIONS_ARCHIEF();
		return elements.map((object) => {
			// eslint-disable-next-line react-hooks/purity
			const randomIndex = Math.floor(Math.random() * allTertiaryColors.length);
			return {
				schemaIdentifier: String(object.mediaItem?.value),
				dctermsFormat: object.mediaItem?.dctermsFormat as ObjectType,
				videoThumbnail: object.videoThumbnail,
				backgroundColor: allTertiaryColors[randomIndex].value as Color,
				cuepoints: {
					start: object.startCuePoint
						? (toSeconds(object.startCuePoint, true) ?? undefined)
						: undefined,
					end: object.endCuePoint ? (toSeconds(object.endCuePoint, true) ?? undefined) : undefined,
				},
			} as HeroCarouselSlideItem;
		});
	}, [elements]);

	const { data: ieObjects, isLoading } = useGetIeObjectsByIds(items);

	return (
		<article className={clsx('c-block-hero-carousel', className)}>
			{backgroundImage && (
				<div
					aria-hidden
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
			{ieObjects?.length && (
				<BlockHeroCarouselCarousel elements={ieObjects} isLoading={isLoading} />
			)}
		</article>
	);
};
