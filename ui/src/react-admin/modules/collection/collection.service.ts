import { Avo } from '@viaa/avo2-types';
import { stringifyUrl } from 'query-string';

import { AdminConfigManager } from '~core/config';
import { CustomError } from '../shared/helpers/custom-error';
import { fetchWithLogoutJson } from '../shared/helpers/fetch-with-logout';

import { ContentTypeNumber } from './collection.types';

export class CollectionService {
	private static getBaseUrl(): string {
		return `${AdminConfigManager.getConfig().database.proxyUrl}/admin/collections`;
	}

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
		return await fetchWithLogoutJson(
			stringifyUrl({
				url: `${this.getBaseUrl()}/public`,
				query: {
					limit,
					typeId,
				},
			}),
			{throwOnNullResponse: true}
		);
	}



	static async fetchCollectionsOrBundlesByTitleOrId(
		isCollection: boolean,
		titleOrId: string,
		limit: number
	): Promise<Avo.Collection.Collection[]> {
		return fetchWithLogoutJson(
			stringifyUrl({
				url: this.getBaseUrl(),
				query: {
					isCollection,
					titleOrId,
					limit,
				},
			}),
			{throwOnNullResponse: true}
		);
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
	 * @param assignmentUuid Collection can be fetched if you're not the owner,
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
			return fetchWithLogoutJson(
				stringifyUrl({
					url: `${this.getBaseUrl()}/fetch-with-items-by-id`,
					query: {
						type,
						assignmentUuid,
						id: collectionId,
						includeFragments: includeFragments ? 'true' : 'false',
					},
				}),
				{throwOnNullResponse: true}
			);
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
