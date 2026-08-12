import type { ButtonAction } from '@viaa/avo2-components';
import React, { type CSSProperties, type FunctionComponent, type ReactNode } from 'react';
import type { Color } from '~modules/content-page/types/content-block.types';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import './BlockHeroCarousel.scss';
import 'swiper/css';
import clsx from 'clsx';
import { BlockHeroCarouselSearch } from '~content-blocks/BlockHeroCarousel/BlockHeroCarouselSearch.tsx';
import { CONTENT_PAGE_WIDTH_TO_REM } from '~modules/content-page/types/content-pages.types.ts';

export interface BlockHeroCarouselProps extends DefaultComponentProps {
	backgroundColor: Color;
	backgroundImage?: string;
	title: string;
	searchAriaLabel: string;
	subtitles: { label: string }[];
	elements: {
		mediaItem?: ButtonAction;
		image: string;
		imageAlt: string;
		title: string;
		textColor: Color;
		backgroundColor: Color;
		itemDisplay: string;
	}[];
}

export const BlockHeroCarousel: FunctionComponent<BlockHeroCarouselProps> = ({
	className,
	backgroundColor,
	backgroundImage,
	title,
	subtitles,
	searchAriaLabel,
	elements,
}): ReactNode => {
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
		</article>
	);
};
