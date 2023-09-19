import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { compact, sortBy } from 'lodash';
import { DataService } from '../data';
import {
	GetEducationLevelsDocument,
	GetEducationLevelsQuery,
	GetSubjectsDocument,
	GetSubjectsQuery,
} from '../shared/generated/graphql-db-types-avo';
import { CustomError } from '../shared/helpers/custom-error';
import { isHetArchief } from '../shared/helpers/is-hetarchief';

@Injectable()
export class LookupService {
	constructor(@Inject(forwardRef(() => DataService)) protected dataService: DataService) {}

	public async fetchSubjects(): Promise<string[]> {
		// not available for archief
		if (isHetArchief()) {
			return [];
		}

		try {
			const response = await this.dataService.execute<GetSubjectsQuery>(GetSubjectsDocument);

			const subjects = (
				(response.lookup_enum_lom_classification || [] || []) as {
					description: string;
				}[]
			).map((item: { description: string }) => item.description);

			return sortBy(subjects, (subject) => subject.toLowerCase());
		} catch (err: any) {
			throw CustomError('Failed to get subjects from the database', err, {
				query: 'GET_SUBJECTS',
			});
		}
	}

	public async fetchEducationLevels(): Promise<string[]> {
		// not available for archief
		if (isHetArchief()) {
			return [];
		}

		try {
			const response = await this.dataService.execute<GetEducationLevelsQuery>(
				GetEducationLevelsDocument
			);

			return compact(
				(response.lookup_enum_lom_context || []).map((item) => item.description)
			);
		} catch (err: any) {
			throw CustomError('Failed to get education levels from the database', err, {
				query: 'GET_EDUCATION_LEVELS',
			});
		}
	}
}
