import { useEffect, useState } from 'react';

import {
	COOKIEBOT_CONSENT_EVENTS,
	type CookieConsentCategory,
	hasCookieConsent,
} from '~shared/helpers/cookiebot';

/**
 * Returns whether the user gave consent for all the given cookie categories
 * - undefined: not known yet (during server side rendering and the first render in the browser)
 * - true/false: the consent of the user, updated when the user changes their consent in the Cookiebot banner
 * Returns true right away if no categories are required, so that content is also server side rendered
 */
export function useCookieConsent(categories: CookieConsentCategory[]): boolean | undefined {
	const categoriesKey = categories.join(',');
	const [hasConsent, setHasConsent] = useState<boolean | undefined>(
		categoriesKey ? undefined : true
	);

	useEffect(() => {
		const requiredCategories = categoriesKey
			? (categoriesKey.split(',') as CookieConsentCategory[])
			: [];
		const updateConsent = () => setHasConsent(hasCookieConsent(requiredCategories));
		updateConsent();
		for (const eventName of COOKIEBOT_CONSENT_EVENTS) {
			window.addEventListener(eventName, updateConsent);
		}
		return () => {
			for (const eventName of COOKIEBOT_CONSENT_EVENTS) {
				window.removeEventListener(eventName, updateConsent);
			}
		};
	}, [categoriesKey]);

	return hasConsent;
}
