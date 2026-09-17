import { type ButtonAction, Image } from '@viaa/avo2-components';
import clsx from 'clsx';
import React, {
	type CSSProperties,
	type FunctionComponent,
	type ReactElement,
	useEffect,
	useState,
} from 'react';
import { useSwiper } from 'swiper/react';
import type { CopyrightComponentState } from '~modules/content-page/types/content-block.types';
import { CopyrightAttribution } from '~shared/components/CopyrightAttribution';
import { generateSmartLink } from '~shared/components/SmartLink/SmartLink.tsx';

import './BlockImageCarousel.scss';

export interface ImageCarouselSlideProps extends CopyrightComponentState {
	title: string;
	image: string;
	imageAlt: string;
	imageAction?: ButtonAction;
}

export const ImageCarouselSlide: FunctionComponent<ImageCarouselSlideProps> = ({
	title,
	image,
	imageAlt,
	imageAction,
	copyrightTitle,
	copyrightText,
	copyrightIconVisible,
}): ReactElement => {
	const [imageWrapperRef, setImageWrapperRef] = useState<HTMLDivElement | null>(null);
	const [imageWidth, setImageWidth] = useState<number | undefined>(undefined);
	const swiper = useSwiper();

	useEffect(() => {
		const imageEl = imageWrapperRef?.querySelector('img');
		if (!imageEl) {
			return;
		}

		const resizeObserver = new ResizeObserver(([entry]) => {
			// Before the image has loaded, its rendered width is 0 (no intrinsic size yet); skip
			// that reading rather than pinning the caption's max-width to 0 until the real one
			// arrives.
			if (entry.contentRect.width > 0) {
				setImageWidth(entry.contentRect.width);
				// Swiper measured slide widths at mount, before any (async-loading) image had a
				// real size, so it can wrongly conclude there's nothing left to scroll. It only
				// re-measures on things like a drag, not on a slide quietly growing afterwards, so
				// tell it explicitly once we know this slide's real (aspect-ratio-driven) width.
				swiper?.update();
			}
		});
		resizeObserver.observe(imageEl);

		return () => resizeObserver.disconnect();
	}, [swiper, imageWrapperRef]);

	return (
		<div
			className="c-block-image-carousel__slide-content"
			style={
				imageWidth === undefined
					? undefined
					: ({
							'--c-block-image-carousel-slide-image-width': `${imageWidth}px`,
						} as CSSProperties)
			}
		>
			{generateSmartLink(
				imageAction,
				<div ref={setImageWrapperRef} className="c-block-image-carousel__slide-image-wrapper">
					<Image
						src={image}
						alt={imageAlt || title}
						className={clsx('c-block-image-carousel__slide-image', {
							'c-block-image-carousel__slide-image--link': !!imageAction,
						})}
						loading="lazy"
					/>
				</div>,
				imageAlt || title
			)}
			{imageWidth !== undefined && (
				<CopyrightAttribution
					className="c-block-image-carousel__slide-image-attribution"
					title={copyrightTitle}
					text={copyrightText}
					showIcon={copyrightIconVisible}
				/>
			)}
		</div>
	);
};
