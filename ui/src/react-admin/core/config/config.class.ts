import type { AdminConfig } from './config.types';

export class AdminConfigManager {
	private static config: AdminConfig;

	public static setConfig(config: AdminConfig): void {
		AdminConfigManager.config = config;
	}

	public static getConfig(): AdminConfig {
		if (!AdminConfigManager.config) {
			throw new Error(
				'AdminConfigManager: Trying to read admin-core config before it has been set.'
			);
		}
		return AdminConfigManager.config || {};
	}

	public static getAdminRoute(name: keyof AdminConfig['routes']): string {
		if (AdminConfigManager.config.routes[name]) {
			return AdminConfigManager.config.routes[name] as string;
		}
		throw new Error(
			JSON.stringify({
				message: 'Trying to read admin-core route from config, but value is undefined',
				additionalInfo: { name, routes: AdminConfigManager.config.routes },
			})
		);
	}

	public static hasAdminRoute(name: keyof AdminConfig['routes']): boolean {
		return !!AdminConfigManager.config.routes[name];
	}
}
