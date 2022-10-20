import { AdminConfig } from './config.types';

export class AdminConfigManager {
	private static config: AdminConfig;

	public static setConfig(config: AdminConfig): void {
		this.config = config;
	}

	public static getConfig(): AdminConfig {
		return this.config;
	}
}
