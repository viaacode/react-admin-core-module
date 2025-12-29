import { forwardRef, Inject, InternalServerErrorException } from '@nestjs/common';
import type { AvoCollectionCollection } from '@viaa/avo2-types';
import { DataService } from '../../data';
import {
	GetPublicCollectionsByIdDocument,
	type GetPublicCollectionsByIdQuery,
	type GetPublicCollectionsByIdQueryVariables,
	GetPublicCollectionsByTitleDocument,
	type GetPublicCollectionsByTitleQuery,
	type GetPublicCollectionsByTitleQueryVariables,
	GetPublicCollectionsDocument,
	type GetPublicCollectionsQuery,
	type GetPublicCollectionsQueryVariables,
} from '../../shared/generated/graphql-db-types-avo';
import { isUuid } from '../../shared/helpers/uuid';
import { ContentTypeNumber } from '../collections.types';

export class CollectionsService {
	constructor(@Inject(forwardRef(() => DataService)) protected dataService: DataService) {}

	/**
	 * Retrieve collections or bundles.
	 *
	 * @param limit Numeric value to define the maximum amount of items in response.
	 * @param typeId 3 for collections, 4 for bundles
	 * @returns Collections limited by `limit`.
	 */
	async fetchCollectionsOrBundles(
		limit: number,
		typeId: ContentTypeNumber
	): Promise<AvoCollectionCollection[]> {
		try {
			// retrieve collections
			const response = await this.dataService.execute<
				GetPublicCollectionsQuery,
				GetPublicCollectionsQueryVariables
			>(GetPublicCollectionsDocument, { limit, typeId });

			return (response.app_collections || []) as AvoCollectionCollection[];
		} catch (err: any) {
			throw new InternalServerErrorException({
				message: 'Het ophalen van de collecties is mislukt.',
				innerException: err,
				additionalInfo: {
					query: 'GET_PUBLIC_COLLECTIONS',
					variables: { limit },
				},
			});
		}
	}

	async fetchCollectionsOrBundlesByTitleOrId(
		isCollection: boolean,
		titleOrId: string,
		limit: number
	): Promise<AvoCollectionCollection[]> {
		try {
			const isUuidFormat = isUuid(titleOrId);
			const variables: Partial<
				GetPublicCollectionsByIdQueryVariables | GetPublicCollectionsByTitleQueryVariables
			> = {
				limit,
				typeId: isCollection ? ContentTypeNumber.collection : ContentTypeNumber.bundle,
			};
			if (isUuidFormat) {
				(variables as GetPublicCollectionsByIdQueryVariables).id = titleOrId;
			} else {
				(variables as GetPublicCollectionsByTitleQueryVariables).title = `%${titleOrId}%`;
			}

			const response = await this.dataService.execute<
				GetPublicCollectionsByIdQuery | GetPublicCollectionsByTitleQuery,
				GetPublicCollectionsByIdQueryVariables | GetPublicCollectionsByTitleQueryVariables
			>(
				isUuidFormat ? GetPublicCollectionsByIdDocument : GetPublicCollectionsByTitleDocument,
				variables as
					| GetPublicCollectionsByIdQueryVariables
					| GetPublicCollectionsByTitleQueryVariables
			);
			return response.app_collections as AvoCollectionCollection[];
		} catch (err: any) {
			throw new InternalServerErrorException({
				message: 'Failed to fetch collections or bundles',
				innerException: err,
				additionalInfo: {
					query: 'GET_PUBLIC_COLLECTIONS_BY_ID or GET_PUBLIC_COLLECTIONS_BY_TITLE',
					variables: { titleOrId, isCollection, limit },
				},
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
	async fetchCollectionsByTitleOrId(
		titleOrId: string,
		limit: number
	): Promise<AvoCollectionCollection[]> {
		return this.fetchCollectionsOrBundlesByTitleOrId(true, titleOrId, limit);
	}

	/**
	 * Retrieve bundles by title.
	 *
	 * @param titleOrId Keyword to search for bundle title.
	 * @param limit Numeric value to define the maximum amount of items in response.
	 *
	 * @returns Bundles limited by `limit`, found using the `title` wildcarded keyword.
	 */
	async fetchBundlesByTitleOrId(
		titleOrId: string,
		limit: number
	): Promise<AvoCollectionCollection[]> {
		return this.fetchCollectionsOrBundlesByTitleOrId(false, titleOrId, limit);
	}
}
