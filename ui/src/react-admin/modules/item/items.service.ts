import type { AvoItemItem } from '@viaa/avo2-types';
import { stringifyUrl } from 'query-string';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getAdminCoreApiUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import { isHetArchief } from '~shared/helpers/is-hetarchief.ts';
import { CustomError } from '../shared/helpers/custom-error';
import { addDefaultAudioStillToItem } from '../shared/helpers/default-still';

// NOTE (client route): ie-object detail pages live under this path on hetarchief.be. Adjust
// the prefix if the client application uses a different detail route for objects.
const OBJECT_DETAIL_PATH_PREFIX = '/pid';

export class ItemsService {
	private static getBaseUrl(): string {
		return `${getAdminCoreApiUrl()}/admin/items`;
	}

	public static async fetchItemById(uuidOrExternalId: string): Promise<AvoItemItem> {
		try {
			const rawItem: AvoItemItem | null = await fetchWithLogoutJson<AvoItemItem>(
				stringifyUrl({
					url: `${ItemsService.getBaseUrl()}/${uuidOrExternalId}`,
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

	public static async fetchPublicItems(limit: number): Promise<AvoItemItem[] | null> {
		return fetchWithLogoutJson(
			stringifyUrl({
				url: ItemsService.getBaseUrl(),
				query: {
					limit,
				},
			})
		);
	}

	public static async fetchPublicItemsByTitleOrExternalId(
		titleOrExternalId: string,
		limit: number
	): Promise<AvoItemItem[]> {
		try {
			return fetchWithLogoutJson(
				stringifyUrl({
					url: ItemsService.getBaseUrl(),
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

	public static getObjectDetailPath(schemaIdentifier: string): string {
		if (!isHetArchief()) {
			throw new CustomError('getObjectDetailPath is only available on hetarchief.be', null, {
				schemaIdentifier,
			});
		}
		return `${OBJECT_DETAIL_PATH_PREFIX}/${encodeURIComponent(schemaIdentifier)}`;
	}
}
