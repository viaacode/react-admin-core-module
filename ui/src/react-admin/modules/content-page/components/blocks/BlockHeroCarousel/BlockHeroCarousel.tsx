import React, { type CSSProperties, type FunctionComponent, type ReactNode } from 'react';
import type { Color } from '~modules/content-page/types/content-block.types';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import './BlockHeroCarousel.scss';
import 'swiper/css';
import clsx from 'clsx';
import type { HeroCarouselBlockComponentState } from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.types.ts';
import { BlockHeroCarouselCarousel } from '~content-blocks/BlockHeroCarousel/BlockHeroCarouselCarousel.tsx';
import { BlockHeroCarouselSearch } from '~content-blocks/BlockHeroCarousel/BlockHeroCarouselSearch.tsx';
import { useGetIeObjectsByIds } from '~content-blocks/BlockHeroCarousel/hooks/useGetIeObjectsByIds.ts';

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
	const { data: ieObjects } = useGetIeObjectsByIds(elements);

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
			{ieObjects && <BlockHeroCarouselCarousel elements={ieObjects} />}
		</article>
	);
};
