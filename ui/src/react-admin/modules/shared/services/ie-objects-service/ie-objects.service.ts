import { CustomError } from '~shared/helpers/custom-error';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getProxyUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import type { PlayableDisplayIeObject } from '~shared/services/ie-objects-service/ie-objects.types.ts';

export class IeObjectsService {
	private static getBaseUrl(): string {
		return `${getProxyUrl()}/ie-objects`;
	}

	/**
	 * Fetches the playable display data for the ie-objects referenced by a content block.
	 *
	 * The objects -- and the snippet start/end times they are cut at -- are read from the stored
	 * block config by the proxy, so they cannot be tampered with here. The response holds one
	 * (possibly null) entry per element of the block, in the block's own order: an element that
	 * has no ie-object selected, or one the visitor has no access to, comes back as null.
	 */
	public static async getPlayableDisplayData(
		blockId: string
	): Promise<(PlayableDisplayIeObject | null)[]> {
		try {
			return await fetchWithLogoutJson<(PlayableDisplayIeObject | null)[]>(
				`${IeObjectsService.getBaseUrl()}/playable-display-data`,
				{
					method: 'POST',
					body: JSON.stringify({ blockId }),
				}
			);
		} catch (err) {
			throw new CustomError('Failed to fetch playable display data for content block', err, {
				blockId,
			});
		}
	}
}
