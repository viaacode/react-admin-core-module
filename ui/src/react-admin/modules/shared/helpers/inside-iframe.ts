export function insideIframe(): boolean {
	try {
		return window.self !== window.top;
	} catch (_e) {
		return true;
	}
}
