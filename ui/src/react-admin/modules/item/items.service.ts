import { Avo } from '@viaa/avo2-types';
import { stringifyUrl } from 'query-string';
import { AdminConfigManager } from '~core/config';
import { fetchWithLogoutJson } from '~modules/shared/helpers/fetch-with-logout';

import { CustomError } from '../shared/helpers/custom-error';
import { addDefaultAudioStillToItem } from '../shared/helpers/default-still';

export class ItemsService {
	private static getBaseUrl(): string {
		return `${AdminConfigManager.getConfig().database.proxyUrl}/items`;
	}

	public static async fetchItemById(uuidOrExternalId: string): Promise<Avo.Item.Item> {
		try {
			const rawItem = await fetchWithLogoutJson(
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
