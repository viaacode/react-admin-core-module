import { AdminConfigManager } from '~core/config';

/**
 * Widths (css px) the srcset w-descriptors are built from. They match the widths the host's
 * image resize service supports.
 */
export const IMAGE_WIDTHS = [150, 320, 640, 960, 1280, 1920, 2560];

/** Width (css px) of the page content column, eg. for images that span the content width */
export const PAGE_CONTENT_IMAGE_WIDTH = 1280;

/** Width (css px) used for the src of images that span the whole screen (sizes="100vw") */
export const SCREEN_IMAGE_WIDTH = 1920;

/** Sizes attribute for an image that fills the viewport up to the given max width (css px) */
export function getImageSizesUpTo(maxWidth: number): string {
	return `(max-width: ${maxWidth}px) 100vw, ${maxWidth}px`;
}

/**
 * Width (css px) and sizes attribute of media (images, video posters) shown at one of the media
 * width options of a content block: a fixed width ('700px', ...) or the page content width ('100%').
 */
export function getMediaImageDisplayWidth(width: string | null | undefined): {
	displayWidth: number;
	sizes?: string;
} {
	const pixels = width?.match(/^(\d+)px$/)?.[1];
	if (pixels) {
		return { displayWidth: Number(pixels) };
	}
	return {
		displayWidth: PAGE_CONTENT_IMAGE_WIDTH,
		sizes: getImageSizesUpTo(PAGE_CONTENT_IMAGE_WIDTH),
	};
}

/** Attribute on an <img> in rich text that holds the urls to try when its src fails to load. */
export const FALLBACK_SRCS_ATTRIBUTE = 'data-fallback-srcs';

function getImageUrlsHook() {
	if (!AdminConfigManager.isConfigSet()) {
		return undefined;
	}
	return AdminConfigManager.getConfig().services?.getImageUrls;
}

/**
 * Urls to load an image at the given display width (css px), in priority order: the primary url
 * first, then the fallbacks. Without a getImageUrls hook in the config (eg. avo) this is [url].
 */
export function getImageUrls(url: string | null | undefined, width: number): string[] {
	if (!url) {
		return [];
	}
	const urls = getImageUrlsHook()?.(url, Math.round(width));
	return urls?.length ? urls : [url];
}

/** The url to load an image from at the given display width (css px). */
export function getPrimaryImageUrl<T extends string | null | undefined>(url: T, width: number): T {
	return (url ? getImageUrls(url, width)[0] : url) as T;
}

/**
 * srcset for an image shown at the given display width (css px), or undefined when the image is
 * not resized, so the src is enough.
 * Without sizes the srcset uses x-descriptors (1x and 2x for high dpi screens). With sizes it uses
 * w-descriptors over IMAGE_WIDTHS, so the browser can pick a width for images that scale with the
 * viewport.
 */
export function getImageSrcSet(
	url: string | null | undefined,
	width: number,
	sizes?: string
): string | undefined {
	if (!url || !getImageUrlsHook()) {
		return undefined;
	}
	if (sizes) {
		const candidates = IMAGE_WIDTHS.map((imageWidth) => ({
			url: getImageUrls(url, imageWidth)[0],
			width: imageWidth,
		}));
		if (candidates.some((candidate) => candidate.url === url)) {
			// Not resized, so the w-descriptors would lie about the image width
			return undefined;
		}
		return candidates.map((candidate) => `${candidate.url} ${candidate.width}w`).join(', ');
	}
	const url1x = getImageUrls(url, width)[0];
	const url2x = getImageUrls(url, width * 2)[0];
	if (url1x === url2x) {
		return undefined;
	}
	return `${url1x} 1x, ${url2x} 2x`;
}

function toCssUrl(url: string): string {
	return `url("${url.replace(/"/g, '%22')}")`;
}

/**
 * Css background-image for an image shown at the given display width (css px): an image-set with
 * a 1x and a 2x url, or a plain url() when the image is not resized.
 */
export function getBackgroundImage(
	url: string | null | undefined,
	width: number
): string | undefined {
	if (!url) {
		return undefined;
	}
	const url1x = getImageUrls(url, width)[0];
	const url2x = getImageUrls(url, width * 2)[0];
	if (url1x === url2x) {
		return toCssUrl(url1x);
	}
	return `image-set(${toCssUrl(url1x)} 1x, ${toCssUrl(url2x)} 2x)`;
}

function decodeHtmlAttribute(value: string): string {
	return value
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&');
}

function encodeHtmlAttribute(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

const IMG_TAG_REGEX = /<img\b[^>]*>/gi;
const SRC_ATTRIBUTE_REGEX = /(\ssrc\s*=\s*)(?:"([^"]*)"|'([^']*)')/i;
const SRCSET_ATTRIBUTE_REGEX = /\ssrcset\s*=/i;
const WIDTH_ATTRIBUTE_REGEX = /\swidth\s*=\s*["']?(\d+)["']?/i;

/**
 * Points the <img> tags in rich text html to resized versions of their images, for a content
 * column of the given width (css px). Every rewritten image gets a data-fallback-srcs attribute
 * that applyImageFallback uses when the image fails to load.
 * Rich text images are shown at their own pixel size (capped by the column), so only images with
 * a width attribute get a 1x/2x srcset: without it the browser would show a 2x image at half its
 * size. The others load a single image at the column width.
 * Images the getImageUrls hook does not change, or that already have a srcset, are left alone.
 */
export function optimizeHtmlImages(html: string, width: number): string {
	if (!html || !getImageUrlsHook()) {
		return html;
	}
	return html.replace(IMG_TAG_REGEX, (imgTag) => {
		const srcMatch = imgTag.match(SRC_ATTRIBUTE_REGEX);
		if (!srcMatch || SRCSET_ATTRIBUTE_REGEX.test(imgTag)) {
			return imgTag;
		}
		const src = decodeHtmlAttribute(srcMatch[2] ?? srcMatch[3] ?? '');
		// An editor can size an image with its width attribute
		const widthAttribute = Number(imgTag.match(WIDTH_ATTRIBUTE_REGEX)?.[1]);
		const displayWidth = widthAttribute ? Math.min(widthAttribute, width) : width;
		const [primaryUrl, ...fallbackUrls] = getImageUrls(src, displayWidth);
		if (!primaryUrl || (primaryUrl === src && !fallbackUrls.length)) {
			return imgTag;
		}
		const srcSet = widthAttribute ? getImageSrcSet(src, displayWidth) : undefined;
		const extraAttributes = [
			srcSet ? ` srcset="${encodeHtmlAttribute(srcSet)}"` : '',
			fallbackUrls.length
				? ` ${FALLBACK_SRCS_ATTRIBUTE}="${encodeHtmlAttribute(JSON.stringify(fallbackUrls))}"`
				: '',
		].join('');
		return imgTag.replace(
			SRC_ATTRIBUTE_REGEX,
			(_match, prefix: string) => `${prefix}"${encodeHtmlAttribute(primaryUrl)}"${extraAttributes}`
		);
	});
}

function getFallbackSrcs(img: HTMLImageElement): string[] {
	try {
		const fallbacks = JSON.parse(img.getAttribute(FALLBACK_SRCS_ATTRIBUTE) || '[]');
		return Array.isArray(fallbacks) ? fallbacks : [];
	} catch {
		return [];
	}
}

/**
 * Switches an <img> rewritten by optimizeHtmlImages to its next fallback url, after it failed to
 * load. Does nothing once all fallbacks have been tried.
 */
export function applyImageFallback(img: HTMLImageElement): void {
	const [nextSrc, ...otherFallbacks] = getFallbackSrcs(img);
	if (!nextSrc) {
		return;
	}
	if (otherFallbacks.length) {
		img.setAttribute(FALLBACK_SRCS_ATTRIBUTE, JSON.stringify(otherFallbacks));
	} else {
		img.removeAttribute(FALLBACK_SRCS_ATTRIBUTE);
	}
	// The srcset takes priority over the src, and only holds urls of the failed (resized) image
	img.removeAttribute('srcset');
	img.removeAttribute('sizes');
	img.src = nextSrc;
}

/**
 * Whether an <img> already failed to load. Images rendered on the server can fail before react
 * hydrates and attaches its error handlers, so components check this on mount.
 */
export function hasImageFailed(img: HTMLImageElement | null | undefined): boolean {
	return !!img && img.complete && img.naturalWidth === 0 && !!img.getAttribute('src');
}
