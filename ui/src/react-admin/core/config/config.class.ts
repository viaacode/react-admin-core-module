import { AdminConfig } from './config.types';

export class AdminConfigManager {
	private static config: AdminConfig;

	public static setConfig(config: AdminConfig): void {
		this.config = config;
	}

	public static getConfig(): AdminConfig {
		return this.config || {};
	}

	public static getAdminRoute(name: keyof AdminConfig['routes']): string {
		if (this.config.routes[name]) {
			return this.config.routes[name] as string;
		} else {
			throw new Error(
				JSON.stringify({
					message: 'Trying to read admin-core route from config, but value is undefined',
					additionalInfo: { name, routes: this.config.routes },
				})
			);
		}
	}
}
