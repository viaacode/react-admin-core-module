import { AdminConfigManager } from '~core/config';

export async function navigateFunc(to: string, options?: { replace?: boolean }) {
	const navigateFunc = AdminConfigManager.getConfig().services.router.navigateFunc;
	await navigateFunc(to, options);
}
