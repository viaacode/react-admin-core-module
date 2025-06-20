import { navigate } from "./link";

/**
 * Go back in browser history, or navigate to a fallback path if the previous page is not from the same domain
 * @param fallbackPath
 * @param history
 */
// biome-ignore lint/suspicious/noExplicitAny: todo
export function goBrowserBackWithFallback(fallbackPath: string, history: any) {
	if (document.referrer.includes(process.env.CLIENT_URL as string)) {
		history.goBack();
	} else {
		navigate(history, fallbackPath);
	}
}
