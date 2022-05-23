import { ConfigValue } from './config.types';

export class Config {
	private static config: ConfigValue;

	public static setConfig(config: ConfigValue): void {
		this.config = config;
	}

	public static getConfig(): ConfigValue {
		return this.config;
	}
}
