import { Avo } from '@viaa/avo2-types';
import { get } from 'lodash-es';

import { CustomError } from '../shared/helpers/custom-error';
import { addDefaultAudioStillToItem } from '../shared/helpers/default-still';
import { dataService } from '../shared/services/data-service';
import { RelationService } from '../shared/services/relation-service/relation.service';

import {
	FetchItemUuidByExternalIdDocument,
	FetchItemUuidByExternalIdQuery,
	FetchItemUuidByExternalIdQueryVariables,
	GetItemByExternalIdDocument,
	GetItemByExternalIdQuery,
	GetItemByExternalIdQueryVariables,
	GetItemByUuidDocument,
	GetItemByUuidQuery,
	GetItemByUuidQueryVariables,
	GetItemDepublishReasonDocument,
	GetItemDepublishReasonQuery,
	GetItemDepublishReasonQueryVariables,
	GetPublicItemsByTitleOrExternalIdDocument,
	GetPublicItemsByTitleOrExternalIdQuery,
	GetPublicItemsByTitleOrExternalIdQueryVariables,
	GetPublicItemsDocument,
	GetPublicItemsQuery,
	GetPublicItemsQueryVariables,
} from '~generated/graphql-db-types-avo';

export class ItemsService {
	public static async fetchItemByUuid(uuid: string): Promise<Avo.Item.Item> {
		let variables: GetItemByUuidQueryVariables | null = null;
		try {
			variables = {
				uuid,
			};

			const response = await dataService.query<
				GetItemByUuidQuery,
				GetItemByUuidQueryVariables
			>({
				query: GetItemByUuidDocument,
				variables,
			});

			const rawItem = response.app_item_meta[0];

			if (!rawItem) {
				throw new CustomError('Response does not contain an item', null, {
					response,
				});
			}

			return addDefaultAudioStillToItem(rawItem);
		} catch (err) {
			throw new CustomError('Failed to get the item from the database', err, {
				variables,
				query: 'GET_ITEM_BY_UUID',
			});
		}
	}

	public static async fetchPublicItems(limit: number): Promise<Avo.Item.Item[] | null> {
		const response = await dataService.query<GetPublicItemsQuery, GetPublicItemsQueryVariables>(
			{
				query: GetPublicItemsDocument,
				variables: { limit },
			}
		);
		return response.app_item_meta as Avo.Item.Item[] | null;
	}

	private static async fetchDepublishReasonByExternalId(
		externalId: string
	): Promise<string | null> {
		const response = await dataService.query<
			GetItemDepublishReasonQuery,
			GetItemDepublishReasonQueryVariables
		>({
			query: GetItemDepublishReasonDocument,
			variables: { externalId },
		});
		return response.app_item_meta?.[0]?.depublish_reason || null;
	}

	public static async fetchItemByExternalId(
		externalId: string
	): Promise<(Avo.Item.Item & { replacement_for?: string }) | null> {
		try {
			const response = await dataService.query<
				GetItemByExternalIdQuery,
				GetItemByExternalIdQueryVariables
			>({
				query: GetItemByExternalIdDocument,
				variables: {
					externalId,
				},
			});

			// Return item if an item is found that is published and not deleted
			const item = response.app_item_meta?.[0];
			if (item) {
				return addDefaultAudioStillToItem(item) || null;
			}

			// Return the replacement item if a REPLACED_BY relation is found for the current item
			// TODO replace with single query to fetch depublish_reason and relations after task is done: https://meemoo.atlassian.net/browse/DEV-1166
			const itemUid = await ItemsService.fetchItemUuidByExternalId(externalId);
			if (itemUid) {
				const relations = await RelationService.fetchRelationsBySubject(
					'item',
					[itemUid],
					'IS_REPLACED_BY'
				);
				const replacedByItemUid = get(relations, '[0].object', null);
				if (replacedByItemUid) {
					const replacementItem = await ItemsService.fetchItemByUuid(replacedByItemUid);
					(replacementItem as any).replacement_for = externalId;
					return replacementItem;
				}
			}

			// Return the depublish reason if the item has a depublish reason
			const depublishReason = await this.fetchDepublishReasonByExternalId(externalId);

			if (depublishReason) {
				return {
					depublish_reason: depublishReason,
				} as Avo.Item.Item;
			}

			// otherwise return null
			return null;
		} catch (err) {
			throw new CustomError('Failed to get item by external id', err, {
				externalId,
				query: 'GET_ITEM_BY_EXTERNAL_ID',
			});
		}
	}

	public static async fetchItemUuidByExternalId(externalId: string): Promise<string | null> {
		const response = await dataService.query<
			FetchItemUuidByExternalIdQuery,
			FetchItemUuidByExternalIdQueryVariables
		>({
			query: FetchItemUuidByExternalIdDocument,
			variables: { externalId },
		});
		return response.app_item_meta[0].uid;
	}

	public static async fetchPublicItemsByTitleOrExternalId(
		titleOrExternalId: string,
		limit: number
	): Promise<Avo.Item.Item[]> {
		try {
			const response = await dataService.query<
				GetPublicItemsByTitleOrExternalIdQuery,
				GetPublicItemsByTitleOrExternalIdQueryVariables
			>({
				query: GetPublicItemsByTitleOrExternalIdDocument,
				variables: {
					limit,
					title: `%${titleOrExternalId}%`,
					externalId: titleOrExternalId,
				},
			});

			let items = response.itemsByExternalId || [];

			if (items.length === 0) {
				items = response.itemsByTitle || [];
			}

			return items as Avo.Item.Item[];
		} catch (err) {
			throw new CustomError('Failed to fetch items by title or external id', err, {
				titleOrExternalId,
				limit,
				query: 'GET_PUBLIC_ITEMS_BY_TITLE_OR_EXTERNAL_ID',
			});
		}
	}
}
