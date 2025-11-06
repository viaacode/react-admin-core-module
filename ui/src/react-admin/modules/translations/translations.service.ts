import { AdminConfigManager } from '~core/config/config.class.js';
import type {
	Component,
	Key,
	Locale,
	Location,
	TranslationEntry,
} from '~modules/translations/translations.core.types.js';
import type { LanguageInfo } from '~modules/translations/translations.types.js';
import { CustomError } from '~shared/helpers/custom-error.js';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout.js';
import { getAdminCoreApiUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config.js';

export class TranslationsService {
	private static getBaseUrl(): string {
		return `${getAdminCoreApiUrl()}/admin/translations`;
	}

	static async fetchTranslations(): Promise<TranslationEntry[]> {
		try {
			return fetchWithLogoutJson(TranslationsService.getBaseUrl());
		} catch (err) {
			throw new CustomError('Failed to fetch translations', err);
		}
	}

	static async fetchLanguages(): Promise<LanguageInfo[]> {
		try {
			return fetchWithLogoutJson(`${TranslationsService.getBaseUrl()}/languages`);
		} catch (err) {
			throw new CustomError('Failed to fetch translations', err);
		}
	}

	/**
	 * Update translation by name
	 * @param component
	 * @param location
	 * @param key
	 * @param languageCode
	 * @param value
	 */
	static async updateTranslation(
		component: Component,
		location: Location,
		key: Key,
		languageCode: Locale,
		value: string
	) {
		try {
			await fetchWithLogoutJson<void>(TranslationsService.getBaseUrl(), {
				method: 'POST',
				body: JSON.stringify({
					component,
					location,
					key,
					languageCode,
					value,
				}),
			});
			await AdminConfigManager.getConfig().services.queryCache.clear('clearTranslations');
		} catch (err) {
			throw new CustomError('Failed to update translations', err, {
				component,
				location,
				key,
				languageCode,
				value,
			});
		}
	}
}
