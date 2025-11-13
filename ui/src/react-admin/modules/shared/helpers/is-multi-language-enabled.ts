import { AdminConfigManager } from '~core/config/config.class';

export function isMultiLanguageEnabled(): boolean {
	return AdminConfigManager.getConfig().components.enableMultiLanguage;
}
