import type { ReactNode } from 'react';
import { AdminConfigManager } from '~core/config';
import type { App } from '~modules/translations/translations.core.types';

export function tText(
	translationKey: string,
	variables?: Record<string, string>,
	apps?: App[]
): string {
	return AdminConfigManager.getConfig().services.i18n.tText(translationKey, variables, apps);
}

export function tHtml(
	translationKey: string,
	variables?: Record<string, string>,
	apps?: App[]
): ReactNode | string {
	return AdminConfigManager.getConfig().services.i18n.tHtml(translationKey, variables, apps);
}
