import { get } from 'lodash-es';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { dataService } from '~modules/shared/services/data-service';
import { AvoOrHetArchief } from '~modules/shared/types';
import { Config } from '../..';
import { TRANSLATIONS_QUERIES } from './queries/translations.queries';

export class TranslationsService {
	private static getQueries() {
		return TRANSLATIONS_QUERIES[Config.getConfig().database.databaseApplicationType];
	}

	static async fetchTranslations(): Promise<any> {
		try {
			// retrieve translations
			const response = await dataService.query({
				query: this.getQueries().GetTranslationsDocument,
			});

			const path = Config.getConfig().database.databaseApplicationType === AvoOrHetArchief.hetArchief ? 'data.app_config' : 'data.app_site_variables';
			return get(response, path, null);
		} catch (err) {
			const error = new CustomError('Failed to fetch translations', err, {
				query: 'GET_TRANSLATIONS',
			});

			console.error(error);

			throw error;
		}
	}

	static async updateTranslations(name: string, translations: any) {
		try {
			// update translation by name
			await dataService.query({
				query: this.getQueries().UpdateTranslationsDocument,
				variables: {
					name,
					translations,
				},
			});
			await Config.getConfig().services.queryCache.clear('clearTranslations');
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
