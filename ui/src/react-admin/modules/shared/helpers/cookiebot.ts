export type CookieConsentCategory = 'preferences' | 'statistics' | 'marketing';

/**
 * Subset of the Cookiebot api, loaded globally by the Cookiebot script tag of the app (hetarchief and avo)
 * https://www.cookiebot.com/en/developer/
 */
interface Cookiebot {
	consent?: Partial<Record<CookieConsentCategory | 'necessary', boolean>>;
	renew: () => void;
}

/**
 * Events Cookiebot dispatches on window when the consent is loaded or changes
 */
export const COOKIEBOT_CONSENT_EVENTS = [
	'CookiebotOnConsentReady',
	'CookiebotOnAccept',
	'CookiebotOnDecline',
] as const;

export function getCookiebot(): Cookiebot | undefined {
	if (typeof window === 'undefined') {
		return undefined;
	}
	return (window as unknown as { Cookiebot?: Cookiebot }).Cookiebot;
}

/**
 * Returns true if the user gave consent for all the given cookie categories
 * Returns true if Cookiebot is not loaded (eg: blocked by an ad blocker or the admin-core demo app), so we don't hide content we cannot ask consent for
 */
export function hasCookieConsent(categories: CookieConsentCategory[]): boolean {
	const cookiebot = getCookiebot();
	if (!cookiebot) {
		return true;
	}
	return categories.every((category) => !!cookiebot.consent?.[category]);
}

/**
 * Open the Cookiebot banner, so the user can change their cookie consent
 * https://support.cookiebot.com/hc/en-us/articles/360003798814-Changing-or-withdrawing-consent
 */
export function openCookieConsentDialog(locale?: string): void {
	if (locale) {
		// The Cookiebot script tag keeps the data-culture of the first page load.
		// Cookiebot reads data-culture again when renew() builds the banner, so sync it with the current website language first.
		document.getElementById('Cookiebot')?.setAttribute('data-culture', locale);
	}
	getCookiebot()?.renew();
}
