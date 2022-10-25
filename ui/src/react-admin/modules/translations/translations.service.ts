import { CustomError } from '~modules/shared/helpers/custom-error';
import { dataService } from '~modules/shared/services/data-service';
import { AvoOrHetArchief } from '~modules/shared/types';
import { AdminConfigManager } from '~core/config';
import { TranslationQueryTypes, TRANSLATIONS_QUERIES } from './queries/translations.queries';

export class TranslationsService {
	private static getQueries() {
		return TRANSLATIONS_QUERIES[
			AdminConfigManager.getConfig().database.databaseApplicationType
		];
	}

	static async fetchTranslations(): Promise<{ name: string; value: Record<string, string> }[]> {
		try {
			// retrieve translations
			const response = await dataService.query<
				TranslationQueryTypes['GetTranslationsQuery'],
				TranslationQueryTypes['GetTranslationsQueryVariables']
			>({
				query: this.getQueries().GetTranslationsDocument,
			});

			if (
				AdminConfigManager.getConfig().database.databaseApplicationType ===
				AvoOrHetArchief.avo
			) {
				return (
					(response as TranslationQueryTypes['GetTranslationsQueryAvo'])
						.app_site_variables || null
				);
			} else {
				return (
					(response as TranslationQueryTypes['GetTranslationsQueryHetArchief'])
						.app_config || null
				);
			}
		} catch (err) {
			const error = new CustomError('Failed to fetch translations', err, {
				query: 'GET_TRANSLATIONS',
			});

			console.error(error);

			throw error;
		}
	}

	/**
	 * Update translation by name
	 * @param name
	 * @param translations
	 */
	static async updateTranslations(name: string, translations: any) {
		try {
			await dataService.query<
				TranslationQueryTypes['UpdateTranslationsMutation'],
				TranslationQueryTypes['UpdateTranslationsMutationVariables']
			>({
				query: this.getQueries().UpdateTranslationsDocument,
				variables: {
					name,
					translations,
				},
			});
			await AdminConfigManager.getConfig().services.queryCache.clear('clearTranslations');
		} catch (err) {
			const error = new CustomError('Failed to update translations', err, {
				query: 'UPDATE_TRANSLATIONS',
				variables: {
					name,
					translations,
				},
			});

			console.error(error);

			throw error;
		}
	}
}
