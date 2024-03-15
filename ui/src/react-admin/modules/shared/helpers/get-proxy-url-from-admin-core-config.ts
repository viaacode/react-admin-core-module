import { AdminConfigManager } from '~core/config';

export function getProxyUrl() {
	return AdminConfigManager.getConfig().database.proxyUrl;
}

export function getAdminCoreApiUrl() {
	return AdminConfigManager.getConfig().database.adminCoreApiUrl || getProxyUrl();
}
