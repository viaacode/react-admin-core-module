import { CustomError } from '~modules/shared/helpers/custom-error';
import { fetchWithLogoutJson } from '~modules/shared/helpers/fetch-with-logout';
import { AdminConfigManager } from '~core/config';

export class TranslationsService {
	private static getBaseUrl(): string {
		return `${AdminConfigManager.getConfig().database.proxyUrl}/translations`;
	}

	static async fetchTranslations(): Promise<Record<string, Record<string, string>>> {
		try {
			return fetchWithLogoutJson(this.getBaseUrl());
		} catch (err) {
			throw new CustomError('Failed to fetch translations', err);
		}
	}

	/**
	 * Update translation by name
	 * @param name
	 * @param translations
	 */
	static async updateTranslations(name: string, translations: any) {
		try {
			await fetchWithLogoutJson(this.getBaseUrl(), {
				method: 'POST',
				body: JSON.stringify({
					key: name,
					data: translations,
				}),
			});
			await AdminConfigManager.getConfig().services.queryCache.clear('clearTranslations');
		} catch (err) {
			throw new CustomError('Failed to update translations', err, {
				key: name,
				data: translations,
			});
		}
	}
}
