import { AdminConfigManager } from '~core/config';

export function isMultiLanguageEnabled(): boolean {
	return AdminConfigManager.getConfig().components.enableMultiLanguage;
}
