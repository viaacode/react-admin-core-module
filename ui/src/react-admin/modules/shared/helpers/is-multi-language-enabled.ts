import { AdminConfigManager } from '~core/config/config.class.js';

export function isMultiLanguageEnabled(): boolean {
	return AdminConfigManager.getConfig().components.enableMultiLanguage;
}
