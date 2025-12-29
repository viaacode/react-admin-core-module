import { forwardRef, Inject } from '@nestjs/common';
import type {
	AvoCollectionCollection,
	AvoCollectionRelationEntry,
	AvoCollectionRelationType,
	AvoItemItem,
} from '@viaa/avo2-types';
import { DataService } from '../data';
import {
	FetchCollectionRelationsBySubjectsDocument,
	type FetchCollectionRelationsBySubjectsQuery,
	type FetchCollectionRelationsBySubjectsQueryVariables,
	FetchItemRelationsBySubjectsDocument,
	type FetchItemRelationsBySubjectsQuery,
	type FetchItemRelationsBySubjectsQueryVariables,
	FetchItemUuidByExternalIdDocument,
	type FetchItemUuidByExternalIdQuery,
	type FetchItemUuidByExternalIdQueryVariables,
	GetItemDetailsByExternalIdDocument,
	type GetItemDetailsByExternalIdQuery,
	type GetItemDetailsByExternalIdQueryVariables,
	GetItemDetailsByUuidDocument,
	type GetItemDetailsByUuidQuery,
	type GetItemDetailsByUuidQueryVariables,
	GetPublicItemsByTitleOrExternalIdDocument,
	type GetPublicItemsByTitleOrExternalIdQuery,
	type GetPublicItemsByTitleOrExternalIdQueryVariables,
	GetPublicItemsDocument,
	type GetPublicItemsQuery,
	type GetPublicItemsQueryVariables,
} from '../shared/generated/graphql-db-types-avo';
import { customError } from '../shared/helpers/custom-error';
import { isUuid } from '../shared/helpers/uuid';

export class ItemsService {
	constructor(@Inject(forwardRef(() => DataService)) protected dataService: DataService) {}

	public async fetchPublicItems(limit: number): Promise<AvoItemItem[] | null> {
		const response = await this.dataService.execute<
			GetPublicItemsQuery,
			GetPublicItemsQueryVariables
		>(GetPublicItemsDocument, { limit });
		return response.app_item_meta as AvoItemItem[] | null;
	}

	private async fetchItemById(uuidOrExternalId: string): Promise<Partial<AvoItemItem>> {
		try {
			let response: GetItemDetailsByUuidQuery | GetItemDetailsByExternalIdQuery;
			if (isUuid(uuidOrExternalId)) {
				response = await this.dataService.execute<
					GetItemDetailsByUuidQuery,
					GetItemDetailsByUuidQueryVariables
				>(GetItemDetailsByUuidDocument, {
					uuid: uuidOrExternalId,
				});
			} else {
				response = await this.dataService.execute<
					GetItemDetailsByExternalIdQuery,
					GetItemDetailsByExternalIdQueryVariables
				>(GetItemDetailsByExternalIdDocument, {
					externalId: uuidOrExternalId,
				});
			}

			const rawItem = response.app_item_meta?.[0];

			if (!rawItem) {
				throw customError('Response does not contain an item', null, {
					response,
				});
			}

			return rawItem as unknown as Partial<AvoItemItem>;
		} catch (err: any) {
			throw customError('Failed to get the item by id from the database', err, {
				uuidOrExternalId,
			});
		}
	}

	public async fetchItemOrReplacement(
		uuidOrExternalId: string
	): Promise<(AvoItemItem & { replacement_for?: string }) | null> {
		try {
			let item = await this.fetchItemById(uuidOrExternalId);

			// Return the replacement item if a REPLACED_BY relation is found for the current item
			const replacedByItemUid = item?.relations?.[0]?.object || null;
			if (replacedByItemUid) {
				const replacementItem = await this.fetchItemById(replacedByItemUid);
				(replacementItem as any).replacement_for = item.external_id;
				item = replacementItem as (AvoItemItem & { replacement_for?: string }) | null;
			}

			// Return the depublish reason if the item has a depublish reason
			if (item.depublish_reason) {
				return {
					depublish_reason: item.depublish_reason,
				} as AvoItemItem;
			}

			return (item || null) as unknown as (AvoItemItem & { replacement_for?: string }) | null;
		} catch (err: any) {
			throw customError('Failed to get item or replacement or depublish reason', err, {
				uuidOrExternalId,
			});
		}
	}

	public async fetchRelationsBySubject(
		type: 'collection' | 'item',
		subjectIds: string[],
		relationType: AvoCollectionRelationType
	): Promise<AvoCollectionRelationEntry<AvoItemItem | AvoCollectionCollection>[]> {
		let variables: any = null;
		const isCollection = type === 'collection';
		try {
			variables = {
				relationType,
				...(subjectIds ? { subjectIds } : {}),
			};
			const response = await this.dataService.execute<
				FetchCollectionRelationsBySubjectsQuery | FetchItemRelationsBySubjectsQuery,
				| FetchCollectionRelationsBySubjectsQueryVariables
				| FetchItemRelationsBySubjectsQueryVariables
			>(
				isCollection
					? FetchCollectionRelationsBySubjectsDocument
					: FetchItemRelationsBySubjectsDocument,
				variables
			);
			if (isCollection) {
				return ((response as FetchCollectionRelationsBySubjectsQuery).app_collection_relations ||
					[]) as AvoCollectionRelationEntry<AvoCollectionCollection>[];
			} else {
				return ((response as FetchItemRelationsBySubjectsQuery).app_item_relations ||
					[]) as AvoCollectionRelationEntry<AvoItemItem>[];
			}
		} catch (err: any) {
			throw customError('Failed to get relation from the database', err, {
				variables,
				query: isCollection
					? 'FETCH_COLLECTION_RELATIONS_BY_OBJECTS or FETCH_COLLECTION_RELATIONS_BY_SUBJECTS'
					: 'FETCH_ITEM_RELATIONS_BY_OBJECTS or FETCH_ITEM_RELATIONS_BY_SUBJECTS',
			});
		}
	}

	public async fetchItemUuidByExternalId(externalId: string): Promise<string | null> {
		const response = await this.dataService.execute<
			FetchItemUuidByExternalIdQuery,
			FetchItemUuidByExternalIdQueryVariables
		>(FetchItemUuidByExternalIdDocument, { externalId });
		return response.app_item_meta?.[0]?.uid;
	}

	public async fetchPublicItemsByTitleOrExternalId(
		titleOrExternalId: string,
		limit: number
	): Promise<AvoItemItem[]> {
		try {
			const response = await this.dataService.execute<
				GetPublicItemsByTitleOrExternalIdQuery,
				GetPublicItemsByTitleOrExternalIdQueryVariables
			>(GetPublicItemsByTitleOrExternalIdDocument, {
				limit,
				title: `%${titleOrExternalId}%`,
				externalId: titleOrExternalId,
			});

			let items = response.itemsByExternalId || [];

			if (items.length === 0) {
				items = response.itemsByTitle || [];
			}

			return items as AvoItemItem[];
		} catch (err: any) {
			throw customError('Failed to fetch items by title or external id', err, {
				titleOrExternalId,
				limit,
				query: 'GET_PUBLIC_ITEMS_BY_TITLE_OR_EXTERNAL_ID',
			});
		}
	}
}
