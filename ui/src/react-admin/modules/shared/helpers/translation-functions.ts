import type { ReactNode } from 'react';
import { AdminConfigManager } from '~core/config/config.class.js';
import type { App } from '~modules/translations/translations.core.types.js';

export function tText(
	translationKey: string,
	variables?: Record<string, string>,
	apps?: App[]
): string {
	return AdminConfigManager.getConfig().services.i18n.tText(
		/* IGNORE_ADMIN_CORE_TRANSLATIONS_EXTRACTION */
		translationKey,
		variables,
		apps
	);
}

export function tHtml(
	translationKey: string,
	variables?: Record<string, string>,
	apps?: App[]
): ReactNode | string {
	return AdminConfigManager.getConfig().services.i18n.tHtml(
		/* IGNORE_ADMIN_CORE_TRANSLATIONS_EXTRACTION */
		translationKey,
		variables,
		apps
	);
}
