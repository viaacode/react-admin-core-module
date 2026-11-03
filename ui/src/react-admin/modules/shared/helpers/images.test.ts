import { afterEach, describe, expect, it } from 'vitest';
import { AdminConfigManager } from '~core/config';
import type { AdminConfig } from '~core/config/config.types';

import {
	applyImageFallback,
	getBackgroundImage,
	getImageSrcSet,
	getImageUrls,
	getPrimaryImageUrl,
	hasImageFailed,
	optimizeHtmlImages,
} from './images';

const ASSET_URL = 'https://assets.example.com/image.jpg';

// Resizes images on the asset server, falls back to the original url
const getImageUrlsMock = (url: string, width: number): string[] => {
	if (!url.startsWith('https://assets.example.com/')) {
		return [url];
	}
	return [`https://proxy.example.com/images/${width}?url=${encodeURIComponent(url)}`, url];
};

function setGetImageUrls(getImageUrls?: AdminConfig['services']['getImageUrls']) {
	AdminConfigManager.setConfig({ services: { getImageUrls } } as AdminConfig);
}

function resized(width: number, url = ASSET_URL): string {
	return `https://proxy.example.com/images/${width}?url=${encodeURIComponent(url)}`;
}

afterEach(() => {
	AdminConfigManager.setConfig(undefined as unknown as AdminConfig);
});

describe('images helpers without a getImageUrls hook', () => {
	it('works when the config is not set', () => {
		expect(getImageUrls(ASSET_URL, 320)).toEqual([ASSET_URL]);
	});

	it('returns the original url', () => {
		setGetImageUrls(undefined);
		expect(getImageUrls(ASSET_URL, 320)).toEqual([ASSET_URL]);
		expect(getPrimaryImageUrl(ASSET_URL, 320)).toEqual(ASSET_URL);
		expect(getImageSrcSet(ASSET_URL, 320)).toBeUndefined();
		expect(getImageSrcSet(ASSET_URL, 320, '100vw')).toBeUndefined();
		expect(getBackgroundImage(ASSET_URL, 320)).toEqual(`url("${ASSET_URL}")`);
	});

	it('leaves rich text untouched', () => {
		setGetImageUrls(undefined);
		const html = `<p><img src="${ASSET_URL}" alt="test"></p>`;
		expect(optimizeHtmlImages(html, 1280)).toBe(html);
	});

	it('handles empty urls', () => {
		expect(getImageUrls(undefined, 320)).toEqual([]);
		expect(getPrimaryImageUrl(null, 320)).toBeNull();
		expect(getBackgroundImage('', 320)).toBeUndefined();
	});
});

describe('images helpers with a getImageUrls hook', () => {
	it('returns the urls from the hook, with a rounded width', () => {
		setGetImageUrls(getImageUrlsMock);
		expect(getImageUrls(ASSET_URL, 319.6)).toEqual([resized(320), ASSET_URL]);
		expect(getPrimaryImageUrl(ASSET_URL, 640)).toEqual(resized(640));
	});

	it('falls back to the original url when the hook returns nothing', () => {
		setGetImageUrls(() => []);
		expect(getImageUrls(ASSET_URL, 320)).toEqual([ASSET_URL]);
	});

	it('builds an x-descriptor srcset', () => {
		setGetImageUrls(getImageUrlsMock);
		expect(getImageSrcSet(ASSET_URL, 640)).toEqual(`${resized(640)} 1x, ${resized(1280)} 2x`);
	});

	it('builds a w-descriptor srcset when sizes is passed', () => {
		setGetImageUrls(getImageUrlsMock);
		expect(getImageSrcSet(ASSET_URL, 640, '100vw')).toEqual(
			[150, 320, 640, 960, 1280, 1920, 2560]
				.map((width) => `${resized(width)} ${width}w`)
				.join(', ')
		);
	});

	it('has no srcset for images the hook does not resize', () => {
		setGetImageUrls(getImageUrlsMock);
		const otherUrl = 'https://other.example.com/image.jpg';
		expect(getImageSrcSet(otherUrl, 640)).toBeUndefined();
		expect(getImageSrcSet(otherUrl, 640, '100vw')).toBeUndefined();
		expect(getBackgroundImage(otherUrl, 640)).toEqual(`url("${otherUrl}")`);
	});

	it('builds a background image-set', () => {
		setGetImageUrls(getImageUrlsMock);
		expect(getBackgroundImage(ASSET_URL, 640)).toEqual(
			`image-set(url("${resized(640)}") 1x, url("${resized(1280)}") 2x)`
		);
	});

	it('escapes quotes in background urls', () => {
		setGetImageUrls(undefined);
		expect(getBackgroundImage('https://example.com/a"b.jpg', 640)).toEqual(
			'url("https://example.com/a%22b.jpg")'
		);
	});
});

describe('optimizeHtmlImages', () => {
	it('rewrites the src and adds fallbacks', () => {
		setGetImageUrls(getImageUrlsMock);
		const html = `<p>text <img alt="test" src="${ASSET_URL}" /></p>`;
		expect(optimizeHtmlImages(html, 1280)).toBe(
			`<p>text <img alt="test" src="${resized(1280).replace(/&/g, '&amp;')}" data-fallback-srcs="[&quot;${ASSET_URL}&quot;]" /></p>`
		);
	});

	it('adds a srcset for the width attribute when it is smaller than the column', () => {
		setGetImageUrls(getImageUrlsMock);
		const html = `<img src='${ASSET_URL}' width="300">`;
		const output = optimizeHtmlImages(html, 1280);
		expect(output).toContain(`src="${resized(300)}"`);
		expect(output).toContain(`srcset="${resized(300)} 1x, ${resized(600)} 2x"`);
	});

	it('decodes html entities in the src', () => {
		const urls: string[] = [];
		setGetImageUrls((url, width) => {
			urls.push(url);
			return getImageUrlsMock(url, width);
		});
		optimizeHtmlImages(`<img src="${ASSET_URL}?a=1&amp;b=2">`, 1280);
		expect(urls[0]).toBe(`${ASSET_URL}?a=1&b=2`);
	});

	it('leaves images alone that are not resized or already have a srcset', () => {
		setGetImageUrls(getImageUrlsMock);
		const html = [
			'<img src="https://other.example.com/image.jpg">',
			`<img src="${ASSET_URL}" srcset="${ASSET_URL} 1x">`,
			'<img alt="no src">',
		].join('');
		expect(optimizeHtmlImages(html, 1280)).toBe(html);
	});
});

describe('applyImageFallback', () => {
	function createImg(html: string): HTMLImageElement {
		const container = document.createElement('div');
		container.innerHTML = html;
		return container.querySelector('img') as HTMLImageElement;
	}

	it('moves through the fallbacks and then stops', () => {
		const img = createImg(
			'<img src="https://a.com/1.jpg" srcset="https://a.com/1.jpg 1x" sizes="100vw" data-fallback-srcs=\'["https://a.com/2.jpg","https://a.com/3.jpg"]\'>'
		);
		applyImageFallback(img);
		expect(img.getAttribute('src')).toBe('https://a.com/2.jpg');
		expect(img.hasAttribute('srcset')).toBe(false);
		expect(img.hasAttribute('sizes')).toBe(false);

		applyImageFallback(img);
		expect(img.getAttribute('src')).toBe('https://a.com/3.jpg');
		expect(img.hasAttribute('data-fallback-srcs')).toBe(false);

		applyImageFallback(img);
		expect(img.getAttribute('src')).toBe('https://a.com/3.jpg');
	});

	it('ignores images without fallbacks', () => {
		const img = createImg('<img src="https://a.com/1.jpg" data-fallback-srcs="invalid">');
		applyImageFallback(img);
		expect(img.getAttribute('src')).toBe('https://a.com/1.jpg');
	});

	it('round-trips with optimizeHtmlImages', () => {
		setGetImageUrls(getImageUrlsMock);
		const img = createImg(optimizeHtmlImages(`<img src="${ASSET_URL}">`, 1280));
		expect(img.getAttribute('src')).toBe(resized(1280));
		applyImageFallback(img);
		expect(img.getAttribute('src')).toBe(ASSET_URL);
		expect(img.hasAttribute('srcset')).toBe(false);
	});
});

describe('hasImageFailed', () => {
	it('detects images that completed without loading', () => {
		const img = document.createElement('img');
		img.setAttribute('src', ASSET_URL);
		Object.defineProperty(img, 'complete', { value: true });
		Object.defineProperty(img, 'naturalWidth', { value: 0 });
		expect(hasImageFailed(img)).toBe(true);
		expect(hasImageFailed(null)).toBe(false);
	});
});
