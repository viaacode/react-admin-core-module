import { Avo } from '@viaa/avo2-types';
import { RelationEntry, RelationType } from '@viaa/avo2-types/types/collection';

import { CustomError } from '../../helpers/custom-error';
import { dataService } from '../data-service';

import {
	FetchCollectionRelationsBySubjectsDocument,
	FetchCollectionRelationsBySubjectsQuery,
	FetchCollectionRelationsBySubjectsQueryVariables,
	FetchItemRelationsBySubjectsDocument,
	FetchItemRelationsBySubjectsQuery,
	FetchItemRelationsBySubjectsQueryVariables,
} from '~generated/graphql-db-types-avo';

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
			const response = await dataService.query<
				FetchCollectionRelationsBySubjectsQuery | FetchItemRelationsBySubjectsQuery,
				| FetchCollectionRelationsBySubjectsQueryVariables
				| FetchItemRelationsBySubjectsQueryVariables
			>({
				variables,
				query: isCollection
					? FetchCollectionRelationsBySubjectsDocument
					: FetchItemRelationsBySubjectsDocument,
			});
			if (isCollection) {
				return ((response as FetchCollectionRelationsBySubjectsQuery)
					.app_collection_relations || []) as RelationEntry<Avo.Collection.Collection>[];
			} else {
				return ((response as FetchItemRelationsBySubjectsQuery).app_item_relations ||
					[]) as RelationEntry<Avo.Item.Item>[];
			}
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
