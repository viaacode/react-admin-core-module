import { Avo } from '@viaa/avo2-types';
import { RelationEntry, RelationType } from '@viaa/avo2-types/types/collection';
import { get } from 'lodash-es';

import {
	FetchCollectionRelationsBySubjectsDocument,
	FetchItemRelationsBySubjectsDocument,
} from '../../../../../generated/graphql-db-types-avo';
import { CustomError } from '../../helpers/custom-error';
import { dataService } from '../data-service';

export class RelationService {
	public static async fetchRelationsBySubject(
		type: 'collection' | 'item',
		subjectIds: string[],
		relationType: RelationType
	): Promise<RelationEntry<Avo.Item.Item | Avo.Collection.Collection>[]> {
		let variables: any;
		const isCollection = type === 'collection';
		try {
			variables = {
				relationType,
				...(subjectIds ? { subjectIds } : {}),
			};
			const response = await dataService.query({
				variables,
				query: isCollection
					? FetchCollectionRelationsBySubjectsDocument
					: FetchItemRelationsBySubjectsDocument,
			});
			if (response.errors) {
				throw new CustomError('Failed due to graphql errors', null, { response });
			}
			return (
				get(
					response,
					isCollection ? 'data.app_collection_relations' : 'data.app_item_relations'
				) || []
			);
		} catch (err) {
			throw new CustomError('Failed to get relation from the database', err, {
				variables,
				query: isCollection
					? 'FETCH_COLLECTION_RELATIONS_BY_OBJECTS or FETCH_COLLECTION_RELATIONS_BY_SUBJECTS'
					: 'FETCH_ITEM_RELATIONS_BY_OBJECTS or FETCH_ITEM_RELATIONS_BY_SUBJECTS',
			});
		}
	}
}
