import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Avo } from '@viaa/avo2-types';
import { sortBy } from 'lodash';
import { DataService } from '../data';
import {
	GetEducationLevelsDocument,
	GetEducationLevelsQuery,
	GetSubjectsDocument,
	GetSubjectsQuery,
	GetThemesDocument,
	GetThemesQuery,
} from '../shared/generated/graphql-db-types-avo';
import { CustomError } from '../shared/helpers/custom-error';
import { isHetArchief } from '../shared/helpers/is-hetarchief';

@Injectable()
export class LookupService {
	constructor(@Inject(forwardRef(() => DataService)) protected dataService: DataService) {}

	public async fetchSubjects(): Promise<Avo.Lom.LomField[]> {
		// not available for archief
		if (isHetArchief()) {
			return [];
		}

		try {
			const response = await this.dataService.execute<GetSubjectsQuery>(GetSubjectsDocument);

			const subjects = (response.lookup_thesaurus || []).map((item) => ({
				id: item.id,
				label: item.label,
			}));

			return sortBy(subjects, (subject) => subject.label.toLowerCase());
		} catch (err: any) {
			throw CustomError('Failed to get subjects from the database', err, {
				query: 'getSubjects',
			});
		}
	}

	public async fetchThemes(): Promise<Avo.Lom.LomField[]> {
		// not available for archief
		if (isHetArchief()) {
			return [];
		}

		try {
			const response = await this.dataService.execute<GetThemesQuery>(GetThemesDocument);

			const themes = (response.lookup_thesaurus || []).map((item) => ({
				id: item.id,
				label: item.label,
			}));

			return sortBy(themes, (theme) => theme.label.toLowerCase());
		} catch (err: any) {
			throw CustomError('Failed to get themes from the database', err, {
				query: 'getThemes',
			});
		}
	}

	public async fetchEducationLevels(): Promise<Avo.Lom.LomField[]> {
		// not available for archief
		if (isHetArchief()) {
			return [];
		}

		try {
			const response = await this.dataService.execute<GetEducationLevelsQuery>(
				GetEducationLevelsDocument
			);

			const educationLevels = (response.lookup_thesaurus || []).map((item) => ({
				id: item.id,
				label: item.label,
				broader: item.broader,
			}));

			return LookupService.blacklistLoms(educationLevels);
		} catch (err: any) {
			throw CustomError('Failed to get education levels from the database', err, {
				query: 'getEducationLevels',
			});
		}
	}

	public static blacklistLoms(loms: Avo.Lom.LomField[]): Avo.Lom.LomField[] {
		// Blacklist certain thesaurus values, so we match witch the list meemoo wants: https://meemoo.atlassian.net/browse/AVO-2753
		const BLACKLIST_NODE_AND_KEEP_CHILDREN = [
			'https://w3id.org/onderwijs-vlaanderen/id/structuur/basisonderwijs',
		];
		const BLACKLIST_NODE_AND_DELETE_CHILDREN = [
			'https://w3id.org/onderwijs-vlaanderen/id/structuur/kleuter-3-jaar-of-jonger',
			'https://w3id.org/onderwijs-vlaanderen/id/structuur/kleuter-4-jaar',
			'https://w3id.org/onderwijs-vlaanderen/id/structuur/kleuter-5-jaar',
			'https://w3id.org/onderwijs-vlaanderen/id/structuur/buitengewoon-basisonderwijs',
			'https://w3id.org/onderwijs-vlaanderen/id/structuur/buitengewoon-secundair-onderwijs',
			'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad-3e-leerjaar',
			'https://w3id.org/onderwijs-vlaanderen/id/structuur/basiseducatie',
			'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-volwassenenonderwijs',
		];

		// Remove BLACKLIST_NODE_AND_KEEP_CHILDREN
		let filteredLoms = loms.filter((lom) => !BLACKLIST_NODE_AND_KEEP_CHILDREN.includes(lom.id));
		filteredLoms.forEach((lom) => {
			if (lom.broader && BLACKLIST_NODE_AND_KEEP_CHILDREN.includes(lom.broader)) {
				lom.broader = null;
			}
		});

		// Remove BLACKLIST_NODE_AND_DELETE_CHILDREN
		const entriesToDelete = BLACKLIST_NODE_AND_DELETE_CHILDREN;
		do {
			const entryToDelete = entriesToDelete.shift();
			filteredLoms = filteredLoms.filter((lom) => lom.id !== entryToDelete);
			filteredLoms.forEach((lom) => {
				if (lom.broader && lom.broader === entryToDelete) {
					entriesToDelete.push(lom.id);
				}
			});
		} while (entriesToDelete.length);

		// Remove all entries more than 2 levels deep
		const firstLevel = filteredLoms.filter((lom) => lom.broader === null);
		const firstLevelIds = firstLevel.map((lom) => lom.id);
		const secondLevel = filteredLoms.filter(
			(lom) => lom.broader && firstLevelIds.includes(lom.broader)
		);

		// Sort by label
		return sortBy([...firstLevel, ...secondLevel], (lom) => lom.label.toLowerCase()).map(
			(lom) => ({ id: lom.id, label: lom.label })
		);
	}
}
