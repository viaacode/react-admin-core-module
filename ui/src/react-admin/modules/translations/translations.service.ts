import { kebabCase } from 'lodash-es';
import { CustomError } from '~shared/helpers/custom-error';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { AdminConfigManager } from '~core/config';
import { isAvo } from '~shared/helpers/is-avo';
import { TranslationContextName } from '~modules/translations/translations.types';

export class TranslationsService {
	private static getBaseUrl(): string {
		return `${AdminConfigManager.getConfig().database.proxyUrl}/admin/translations`;
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
	static async updateTranslations(name: TranslationContextName, translations: any) {
		try {
			const response = await fetchWithLogoutJson<{ affectedRows: number }>(
				this.getBaseUrl(),
				{
					method: 'POST',
					body: JSON.stringify({
						key: isAvo() ? kebabCase(name) : name, // TODO at some point try to update translation site variable keys in the avo database to match hetarchief
						data: translations,
					}),
				}
			);
			if (response.affectedRows !== 1) {
				throw new CustomError(
					'Failed to update translation. Number of affected rows was not 1',
					null,
					{ response }
				);
			}
			await AdminConfigManager.getConfig().services.queryCache.clear('clearTranslations');
		} catch (err) {
			throw new CustomError('Failed to update translations', err, {
				key: name,
				data: translations,
			});
		}
	}
}
