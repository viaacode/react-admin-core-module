import { AdminConfigManager } from '~core/config';

export async function navigateFunc(to: string | URL, options?: { replace?: boolean }) {
	const navigateFunc = AdminConfigManager.getConfig().services.router.navigateFunc;
	if (typeof to === 'string') {
		await navigateFunc(to, options);
	} else {
		const newUrl = `${to.pathname}?${to.searchParams.toString()}`;
		await navigateFunc(newUrl, options);
	}
}
