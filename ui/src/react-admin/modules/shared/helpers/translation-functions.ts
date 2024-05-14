import { ReactNode } from 'react';
import { AdminConfigManager } from '~core/config';
import { DatabaseType } from '~shared/types';

export function tText(
	translationKey: string,
	variables?: Record<string, string>,
	apps?: DatabaseType[]
): string {
	return AdminConfigManager.getConfig().services.i18n.tText(translationKey, variables, apps);
}

export function tHtml(
	translationKey: string,
	variables?: Record<string, string>,
	apps?: DatabaseType[]
): ReactNode | string {
	return AdminConfigManager.getConfig().services.i18n.tHtml(translationKey, variables, apps);
}
