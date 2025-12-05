import { AdminConfigManager } from '~core/config';

export function navigateFunc(to: string | URL, options?: { replace?: boolean }) {
	const navigateFunc = AdminConfigManager.getConfig().services.router.navigateFunc;
	if (typeof to === 'string') {
		navigateFunc(to, options);
	} else {
		navigateFunc(`${to.pathname}?${to.searchParams.toString()}`, options);
	}
}
