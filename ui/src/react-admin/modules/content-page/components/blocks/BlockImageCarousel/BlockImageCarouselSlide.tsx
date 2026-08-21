import { Image } from '@viaa/avo2-components';
import clsx from 'clsx';
import React, {
	type CSSProperties,
	type FunctionComponent,
	type ReactElement,
	useEffect,
	useRef,
	useState,
} from 'react';
import { useSwiper } from 'swiper/react';
import type { CopyrightComponentState } from '~modules/content-page/types/content-block.types';
import { CopyrightAttribution } from '~shared/components/CopyrightAttribution';

import './BlockImageCarousel.scss';

export interface ImageCarouselSlideProps extends CopyrightComponentState {
	title: string;
	image: string;
	imageAlt: string;
}

export const ImageCarouselSlide: FunctionComponent<ImageCarouselSlideProps> = ({
	title,
	image,
	imageAlt,
	copyrightTitle,
	copyrightText,
	copyrightIconVisible,
}): ReactElement => {
	const imageWrapperRef = useRef<HTMLDivElement>(null);
	const [imageWidth, setImageWidth] = useState<number | undefined>(undefined);
	const swiper = useSwiper();

	useEffect(() => {
		const imageEl = imageWrapperRef.current?.querySelector('img');
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
	}, [swiper]);

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
			<div ref={imageWrapperRef} className="c-block-image-carousel__slide-image-wrapper">
				<Image
					src={image}
					alt={imageAlt || title}
					className={clsx('c-block-image-carousel__slide-image')}
					loading="lazy"
				/>
			</div>
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
