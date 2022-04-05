import { Avo } from '@viaa/avo2-types';
import { get } from 'lodash-es';
import { stringify } from 'query-string';

import { Config } from '~core/config';
import { CustomError } from '../shared/helpers/custom-error';
import { fetchWithLogout } from '../shared/helpers/fetch-with-logout';
import { performQuery } from '../shared/helpers/gql';
import { isUuid } from '../shared/helpers/uuid';
import { dataService } from '../shared/services/data-service';

import { ContentTypeNumber } from './collection.types';

import {
	GetPublicCollectionsByIdDocument,
	GetPublicCollectionsByTitleDocument,
	GetPublicCollectionsDocument,
} from '~generated/graphql-db-types-avo';

export class CollectionService {
	/**
	 * Retrieve collections or bundles.
	 *
	 * @param limit Numeric value to define the maximum amount of items in response.
	 * @param typeId 3 for collections, 4 for bundles
	 * @returns Collections limited by `limit`.
	 */
	static async fetchCollectionsOrBundles(
		limit: number,
		typeId: ContentTypeNumber
	): Promise<Avo.Collection.Collection[]> {
		try {
			// retrieve collections
			const response = await performQuery(
				{
					query: GetPublicCollectionsDocument,
					variables: { limit, typeId },
				},
				['data.app_collections'],
				'Het ophalen van de collecties is mislukt.'
			);

			return response || [];
		} catch (err) {
			throw new CustomError('Het ophalen van de collecties is mislukt.', err, {
				query: 'GET_PUBLIC_COLLECTIONS',
				variables: { limit },
			});
		}
	}

	static async fetchCollectionsOrBundlesByTitleOrId(
		isCollection: boolean,
		titleOrId: string,
		limit: number
	): Promise<Avo.Collection.Collection[]> {
		try {
			const isUuidFormat = isUuid(titleOrId);
			const variables: any = {
				limit,
				typeId: isCollection ? ContentTypeNumber.collection : ContentTypeNumber.bundle,
			};
			if (isUuidFormat) {
				variables.id = titleOrId;
			} else {
				variables.title = `%${titleOrId}%`;
			}

			return (
				(await performQuery(
					{
						variables,
						query: isUuidFormat
							? GetPublicCollectionsByIdDocument
							: GetPublicCollectionsByTitleDocument,
					},
					['data.app_collections'],
					'Failed to retrieve items by title or external id.'
				)) || []
			);
		} catch (err) {
			throw new CustomError('Failed to fetch collections or bundles', err, {
				query: 'GET_PUBLIC_COLLECTIONS_BY_ID or GET_PUBLIC_COLLECTIONS_BY_TITLE',
				variables: { titleOrId, isCollection, limit },
			});
		}
	}

	/**
	 * Retrieve collections by title.
	 *
	 * @param titleOrId Keyword to search for collection title or the collection id
	 * @param limit Numeric value to define the maximum amount of items in response.
	 *
	 * @returns Collections limited by `limit`, found using the `title` wildcarded keyword.
	 */
	static async fetchCollectionsByTitleOrId(
		titleOrId: string,
		limit: number
	): Promise<Avo.Collection.Collection[]> {
		return CollectionService.fetchCollectionsOrBundlesByTitleOrId(true, titleOrId, limit);
	}

	/**
	 * Retrieve bundles by title.
	 *
	 * @param titleOrId Keyword to search for bundle title.
	 * @param limit Numeric value to define the maximum amount of items in response.
	 *
	 * @returns Bundles limited by `limit`, found using the `title` wildcarded keyword.
	 */
	static async fetchBundlesByTitleOrId(
		titleOrId: string,
		limit: number
	): Promise<Avo.Collection.Collection[]> {
		return CollectionService.fetchCollectionsOrBundlesByTitleOrId(false, titleOrId, limit);
	}

	/**
	 * Retrieve collection or bundle and underlying items or collections by id.
	 *
	 * @param collectionId Unique id of the collection that must be fetched.
	 * @param type Type of which items should be fetched.
	 * @param assignmentUuid Collection can be fetched if it's not and you're not the owner,
	 *        but if it is linked to an assignment that you're trying to view
	 *
	 * @param includeFragments
	 * @returns Collection or bundle.
	 */
	public static async fetchCollectionOrBundleById(
		collectionId: string,
		type: 'collection' | 'bundle',
		assignmentUuid: string | undefined,
		includeFragments = true
	): Promise<Avo.Collection.Collection | null> {
		try {
			const response = await fetchWithLogout(
				`${
					Config.getConfig().database.proxyUrl
				}/collections/fetch-with-items-by-id?${stringify({
					type,
					assignmentUuid,
					id: collectionId,
					includeFragments: includeFragments ? 'true' : 'false',
				})}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
				}
			);
			if (response.status === 404) {
				return null;
			}
			if (response.status < 200 || response.status >= 400) {
				throw new CustomError('invalid status code', null, {
					collectionId,
					type,
					response,
					statusCode: response.status,
				});
			}
			return await response.json();
		} catch (err) {
			if (JSON.stringify(err).includes('COLLECTION_NOT_FOUND')) {
				return null;
			}
			throw new CustomError('Failed to get collection or bundle with items', err, {
				collectionId,
				type,
			});
		}
	}
}
