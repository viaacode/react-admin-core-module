import { get, sortBy } from 'lodash-es';

import { dataService } from '../data-service';
import { AdminConfigManager } from '~core/config';
import { AvoOrHetArchief } from '../../types';
import { CustomError } from '../../helpers/custom-error';

import {
	GetEducationLevelsDocument,
	GetSubjectsDocument
} from '~generated/graphql-db-types-avo';

export class SettingsService {
	public static async fetchSubjects(): Promise<string[]> {
		// not available for archief
		if (AdminConfigManager.getConfig().database.databaseApplicationType === AvoOrHetArchief.hetArchief) {
			return [];
		}

		try {
			const response = await dataService.query({
				query: GetSubjectsDocument,
			});

			if (response.errors) {
				throw new CustomError('GraphQL response contains errors', null, { response });
			}

			const subjects = ((get(response, 'data.lookup_enum_lom_classification', []) || []) as {
				description: string;
			}[]).map((item: { description: string }) => item.description);

			return sortBy(subjects, (subject) => subject.toLowerCase());
		} catch (err) {
			throw new CustomError('Failed to get subjects from the database', err, {
				query: 'GET_SUBJECTS',
			});
		}
	}

	public static async fetchEducationLevels(): Promise<string[]> {
		// not available for archief
		if (AdminConfigManager.getConfig().database.databaseApplicationType === AvoOrHetArchief.hetArchief) {
			return [];
		}

		try {
			const response = await dataService.query({
				query: GetEducationLevelsDocument,
			});

			if (response.errors) {
				throw new CustomError('GraphQL response contains errors', null, { response });
			}

			return ((get(response, 'data.lookup_enum_lom_context') || []) as {
				description: string;
			}[]).map((item: { description: string }) => item.description);
		} catch (err) {
			throw new CustomError('Failed to get education levels from the database', err, {
				query: 'GET_EDUCATION_LEVELS',
			});
		}
	}
}
