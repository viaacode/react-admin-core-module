import { afterEach, describe, expect, it } from 'vitest';

import { hasCookieConsent } from './cookiebot';

function setCookiebot(cookiebot: unknown) {
	(window as unknown as { Cookiebot?: unknown }).Cookiebot = cookiebot;
}

describe('hasCookieConsent', () => {
	afterEach(() => {
		setCookiebot(undefined);
	});

	it('Should return true when Cookiebot is not loaded, eg: blocked by an ad blocker', () => {
		expect(hasCookieConsent(['statistics', 'marketing'])).toBe(true);
	});

	it('Should return true when the user accepted all required categories', () => {
		setCookiebot({ consent: { statistics: true, marketing: true }, renew: () => {} });
		expect(hasCookieConsent(['statistics', 'marketing'])).toBe(true);
	});

	it('Should return false when the user did not accept one of the required categories', () => {
		setCookiebot({ consent: { statistics: true, marketing: false }, renew: () => {} });
		expect(hasCookieConsent(['statistics', 'marketing'])).toBe(false);
	});

	it('Should return true when no categories are required', () => {
		setCookiebot({ consent: { statistics: false, marketing: false }, renew: () => {} });
		expect(hasCookieConsent([])).toBe(true);
	});
});
