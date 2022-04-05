import { Avo } from '@viaa/avo2-types';
import { get } from 'lodash-es';

import { CustomError } from '../shared/helpers/custom-error';
import { addDefaultAudioStillToItem } from '../shared/helpers/default-still';
import { performQuery } from '../shared/helpers/gql';
import { dataService } from '../shared/services/data-service';
import { RelationService } from '../shared/services/relation-service/relation.service';

import {
	FetchItemUuidByExternalIdDocument,
	GetItemByExternalIdDocument,
	GetItemByUuidDocument,
	GetItemDepublishReasonDocument,
	GetPublicItemsByTitleOrExternalIdDocument,
	GetPublicItemsDocument,
} from 'generated/graphql-db-types-avo';

export class ItemsService {
	public static async fetchItemByUuid(uuid: string): Promise<Avo.Item.Item> {
		let variables: any;
		try {
			variables = {
				uuid,
			};

			const response = await dataService.query({
				variables,
				query: GetItemByUuidDocument,
			});

			const rawItem = get(response, 'data.app_item_meta[0]');

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

	public static async fetchPublicItems(limit?: number): Promise<Avo.Item.Item[] | null> {
		const query = {
			query: GetPublicItemsDocument,
			variables: { limit },
		};

		return performQuery(
			query,
			['data.app_item_meta'],
			'Failed to retrieve items. GET_PUBLIC_ITEMS'
		);
	}

	private static async fetchDepublishReasonByExternalId(externalId: string): Promise<string> {
		const query = {
			query: GetItemDepublishReasonDocument,
			variables: { externalId },
		};

		return performQuery(
			query,
			['data.app_item_meta[0].depublish_reason'],
			'Failed to retrieve depublish reason for item. GET_ITEM_DEPUBLISH_REASON'
		);
	}

	public static async fetchItemByExternalId(
		externalId: string
	): Promise<(Avo.Item.Item & { replacement_for?: string }) | null> {
		try {
			const response = await dataService.query({
				query: GetItemByExternalIdDocument,
				variables: {
					externalId,
				},
			});

			if (response.errors) {
				throw new CustomError('Response contains graphql errors', null, { response });
			}

			// Return item if an item is found that is published and not deleted
			const item = get(response, 'data.app_item_meta[0]');
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
		return performQuery(
			{ query: FetchItemUuidByExternalIdDocument, variables: { externalId } },
			['data.app_item_meta[0].uid'],
			'Failed to fetch item uuid by external id (FETCH_ITEM_UUID_BY_EXTERNAL_ID)'
		);
	}

	public static async fetchPublicItemsByTitleOrExternalId(
		titleOrExternalId: string,
		limit?: number
	): Promise<Avo.Item.Item[]> {
		try {
			const query = {
				query: GetPublicItemsByTitleOrExternalIdDocument,
				variables: {
					limit,
					title: `%${titleOrExternalId}%`,
					externalId: titleOrExternalId,
				},
			};

			const response = await performQuery(
				query,
				['data'],
				'Failed to retrieve items by title or external id.'
			);

			let items = get(response, 'itemsByExternalId', []);

			if (items.length === 0) {
				items = get(response, 'itemsByTitle', []);
			}

			return items;
		} catch (err) {
			throw new CustomError('Failed to fetch items by title or external id', err, {
				titleOrExternalId,
				limit,
				query: 'GET_PUBLIC_ITEMS_BY_TITLE_OR_EXTERNAL_ID',
			});
		}
	}
}
