import type { Avo } from '@viaa/avo2-types';
import { stringifyUrl } from 'query-string';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getAdminCoreApiUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';

import { CustomError } from '../shared/helpers/custom-error';
import { addDefaultAudioStillToItem } from '../shared/helpers/default-still';

export class ItemsService {
	private static getBaseUrl(): string {
		return `${getAdminCoreApiUrl()}/admin/items`;
	}

	public static async fetchItemById(uuidOrExternalId: string): Promise<Avo.Item.Item> {
		try {
			const rawItem: Avo.Item.Item | null = await fetchWithLogoutJson<Avo.Item.Item>(
				stringifyUrl({
					url: this.getBaseUrl() + '/' + uuidOrExternalId,
				})
			);

			if (!rawItem) {
				throw new CustomError('Response does not contain an item', null, {
					rawItem,
				});
			}

			return addDefaultAudioStillToItem(rawItem);
		} catch (err) {
			throw new CustomError('Failed to get the item from the database', err, {
				uuidOrExternalId,
			});
		}
	}

	public static async fetchPublicItems(limit: number): Promise<Avo.Item.Item[] | null> {
		return fetchWithLogoutJson(
			stringifyUrl({
				url: this.getBaseUrl(),
				query: {
					limit,
				},
			})
		);
	}

	public static async fetchPublicItemsByTitleOrExternalId(
		titleOrExternalId: string,
		limit: number
	): Promise<Avo.Item.Item[]> {
		try {
			return fetchWithLogoutJson(
				stringifyUrl({
					url: this.getBaseUrl(),
					query: {
						titleOrExternalId,
						limit,
					},
				})
			);
		} catch (err) {
			throw new CustomError('Failed to fetch items by title or external id', err, {
				titleOrExternalId,
				limit,
			});
		}
	}
}
