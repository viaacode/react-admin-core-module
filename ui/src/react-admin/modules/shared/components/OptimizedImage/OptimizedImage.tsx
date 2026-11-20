import clsx from 'clsx';
import type { FunctionComponent, ImgHTMLAttributes, Ref } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getImageSrcSet, getImageUrls, hasImageFailed } from '~shared/helpers/images';

export interface OptimizedImgProps
	extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height' | 'alt'> {
	src: string | null | undefined;
	alt: string | undefined;
	/** Width (css px) the image is shown at, used to pick the resized version of the image */
	displayWidth: number;
	/**
	 * Sizes attribute for images that scale with the viewport. Switches the srcset from 1x/2x
	 * descriptors to width descriptors.
	 */
	sizes?: string;
	/**
	 * The css does not set the width of the image, so it is shown at its own pixel size (capped by
	 * a max-width). Such an image gets no srcset, since the browser would show a 2x image at half
	 * its pixel size. The src is loaded at displayWidth, so it should be at least the max width the
	 * image can be shown at.
	 */
	intrinsicSize?: boolean;
	ref?: Ref<HTMLImageElement>;
}

/**
 * <img> that loads a resized version of its image through the getImageUrls hook in the admin-core
 * config, and moves on to the hook's fallback urls when that fails to load.
 * Without the hook (eg. avo) it is a plain <img src>.
 */
export const OptimizedImg: FunctionComponent<OptimizedImgProps> = ({
	src,
	alt,
	displayWidth,
	sizes,
	intrinsicSize = false,
	ref,
	onError,
	...imgProps
}) => {
	const imgRef = useRef<HTMLImageElement | null>(null);
	const urls = getImageUrls(src, displayWidth);
	// Index of the url in urls that is currently tried. Resets when the src changes.
	const [fallback, setFallback] = useState({ src, index: 0 });
	const urlIndex = fallback.src === src ? fallback.index : 0;
	const srcSet =
		urlIndex === 0 && !intrinsicSize ? getImageSrcSet(src, displayWidth, sizes) : undefined;

	const tryNextUrl = useCallback(() => {
		setFallback((previous) => {
			const previousIndex = previous.src === src ? previous.index : 0;
			return { src, index: Math.min(previousIndex + 1, urls.length - 1) };
		});
	}, [src, urls.length]);

	const setRefs = useCallback(
		(img: HTMLImageElement | null) => {
			imgRef.current = img;
			if (typeof ref === 'function') {
				ref(img);
			} else if (ref) {
				ref.current = img;
			}
		},
		[ref]
	);

	// Images rendered on the server can fail before hydration, so their onError never fires
	useEffect(() => {
		if (hasImageFailed(imgRef.current)) {
			tryNextUrl();
		}
	}, [tryNextUrl]);

	if (!urls.length) {
		return null;
	}

	return (
		<img
			{...imgProps}
			ref={setRefs}
			src={urls[urlIndex]}
			alt={alt}
			srcSet={srcSet}
			sizes={srcSet ? sizes : undefined}
			onError={(event) => {
				if (urlIndex < urls.length - 1) {
					tryNextUrl();
				}
				onError?.(event);
			}}
		/>
	);
};

export interface OptimizedImageProps extends Omit<OptimizedImgProps, 'className'> {
	/** Class of the wrapper div */
	className?: string;
	/**
	 * Stretches the image to the full width of its container. Without it the image is shown at its
	 * own pixel size, unless the css of the block sets its width (see intrinsicSize).
	 */
	wide?: boolean;
}

/**
 * Drop-in replacement for the avo2-components Image (same wrapper markup and classes, so the
 * existing styling keeps working) that loads resized images, see OptimizedImg.
 */
export const OptimizedImage: FunctionComponent<OptimizedImageProps> = ({
	className,
	wide,
	...imgProps
}) => {
	return (
		<div className={clsx(className, 'c-image', { 'c-image--full': wide })}>
			<OptimizedImg {...imgProps} />
		</div>
	);
};
