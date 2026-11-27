import { act, cleanup, render } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { AdminConfigManager } from '~core/config/config.class';
import type { AdminConfig } from '~core/config/config.types';

import { BlockIFrame, getRequiredCookieConsent } from './BlockIFrame';

function setCookiebot(cookiebot: unknown) {
	(window as unknown as { Cookiebot?: unknown }).Cookiebot = cookiebot;
}

beforeAll(() => {
	AdminConfigManager.setConfig({
		locale: 'nl',
		services: { i18n: { tText: (key: string) => key } },
	} as unknown as AdminConfig);
});

afterEach(() => {
	cleanup();
	setCookiebot(undefined);
});

describe('<BlockIFrame />', () => {
	it('Should be able to render', () => {
		render(<BlockIFrame title="test" />);
	});

	it('Should correctly set the wrapper `className`', () => {
		const { container } = render(<BlockIFrame title="test" />);
		const aspectRatioWrapper = container.querySelector('div');
		expect(aspectRatioWrapper).toHaveClass('c-aspect-ratio-wrapper');
	});

	it('Should correctly set the wrapper `className` for the aspect ratios', () => {
		const { container: container32 } = render(<BlockIFrame title="test" ratio="3:2" />);
		const { container: container169 } = render(<BlockIFrame title="test" ratio="16:9" />);
		const video32Wrapper = container32.querySelector('div');
		const video169Wrapper = container169.querySelector('div');
		expect(video32Wrapper).toHaveClass('c-aspect-ratio-wrapper--aspect-3-2');
		expect(video169Wrapper).toHaveClass('c-aspect-ratio-wrapper--aspect-16-9');
	});

	it('Should correctly pass on the supported iframe-props', () => {
		const iframeProps = {
			title: 'hello',
			width: 800,
			height: 450,
			margin: 30,
			frameBorder: '0',
			allowFullScreen: true,
			allowTransparency: true,
			seamless: true,
		};
		const { container } = render(<BlockIFrame {...iframeProps} />);
		const iframeElement = container.querySelector('iframe');
		for (const [key, value] of Object.entries(iframeProps)) {
			if (key === 'title' || key === 'width' || key === 'height' || key === 'frameBorder') {
				expect(iframeElement).toHaveAttribute(key, value.toString());
			}
		}
	});
});

describe('getRequiredCookieConsent', () => {
	it('Should require statistics and marketing cookies for vimeo and youtube', () => {
		expect(getRequiredCookieConsent('https://player.vimeo.com/video/1247911000')).toEqual([
			'statistics',
			'marketing',
		]);
		expect(getRequiredCookieConsent('player.vimeo.com/video/1247911000')).toEqual([
			'statistics',
			'marketing',
		]);
		expect(getRequiredCookieConsent('//www.youtube-nocookie.com/embed/abc')).toEqual([
			'statistics',
			'marketing',
		]);
	});

	it('Should not require consent for other hosts', () => {
		expect(getRequiredCookieConsent('https://hetarchief.be/embed')).toEqual([]);
		expect(getRequiredCookieConsent('https://notvimeo.com/video/1')).toEqual([]);
		expect(getRequiredCookieConsent(undefined)).toEqual([]);
	});
});

describe('<BlockIFrame /> cookie consent', () => {
	const vimeoSrc = 'https://player.vimeo.com/video/1247911000';

	it('Should show a placeholder instead of the iframe without consent', () => {
		setCookiebot({ consent: { statistics: false, marketing: false }, renew: () => {} });
		const { container } = render(<BlockIFrame title="test" src={vimeoSrc} />);
		expect(container.querySelector('iframe')).toBeNull();
		expect(container.querySelector('.c-block-iframe__consent-message')).not.toBeNull();
	});

	it('Should load the iframe once the user accepts the cookies', () => {
		const cookiebot = { consent: { statistics: false, marketing: false }, renew: () => {} };
		setCookiebot(cookiebot);
		const { container } = render(<BlockIFrame title="test" src={vimeoSrc} />);
		expect(container.querySelector('iframe')).toBeNull();

		act(() => {
			cookiebot.consent = { statistics: true, marketing: true };
			window.dispatchEvent(new Event('CookiebotOnAccept'));
		});
		expect(container.querySelector('iframe')).toHaveAttribute('src', vimeoSrc);
	});

	it('Should load iframes of other hosts without consent', () => {
		setCookiebot({ consent: { statistics: false, marketing: false }, renew: () => {} });
		const { container } = render(<BlockIFrame title="test" src="https://hetarchief.be/embed" />);
		expect(container.querySelector('iframe')).toHaveAttribute('src', 'https://hetarchief.be/embed');
	});
});
