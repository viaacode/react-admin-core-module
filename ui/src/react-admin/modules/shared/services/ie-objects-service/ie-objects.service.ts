import { CustomError } from '~shared/helpers/custom-error';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getProxyUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import type { PlayableDisplayIeObject } from '~shared/services/ie-objects-service/ie-objects.types.ts';

export class IeObjectsService {
	private static getBaseUrl(): string {
		return `${getProxyUrl()}/ie-objects`;
	}

	public static async getPlayableDisplayData(
		schemaIdentifiers:
			| string[]
			| {
					schemaIdentifier: string;
					start?: number;
					end?: number;
			  }[]
	): Promise<PlayableDisplayIeObject[]> {
		try {
			return await fetchWithLogoutJson<PlayableDisplayIeObject[]>(
				`${IeObjectsService.getBaseUrl()}/playable-display-data`,
				{
					method: 'POST',
					body: JSON.stringify({ objects: schemaIdentifiers }),
				}
			);
		} catch (err) {
			throw new CustomError('Failed to fetch themes', err, {
				schemaIdentifiers,
			});
		}
	}
}
