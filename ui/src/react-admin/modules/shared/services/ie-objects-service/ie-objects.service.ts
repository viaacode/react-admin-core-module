import { CustomError } from '~shared/helpers/custom-error';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getProxyUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import type { PlayableDisplayIeObject } from '~shared/services/ie-objects-service/ie-objects.types.ts';

export class IeObjectsService {
	private static getBaseUrl(): string {
		return `${getProxyUrl()}/ie-objects`;
	}

	public static async getPlayableDisplayData(
		schemaIdentifiers: string[] | Partial<PlayableDisplayIeObject>[]
	): Promise<PlayableDisplayIeObject[]> {
		// TODO remove this mapping and the endpoint should only accept the blockId
		// Callers can pass bare schema identifiers or (partial) ie-objects -- pass strings through
		// as-is, and flatten objects down to the shape the endpoint expects, pulling start/end out
		// of the nested snipPoint.
		const objects = schemaIdentifiers.map((item) =>
			typeof item === 'string'
				? item
				: {
						schemaIdentifier: item.schemaIdentifier,
						start: item.snipPoint?.start,
						end: item.snipPoint?.end,
					}
		);
		try {
			return await fetchWithLogoutJson<PlayableDisplayIeObject[]>(
				`${IeObjectsService.getBaseUrl()}/playable-display-data`,
				{
					method: 'POST',
					body: JSON.stringify({ objects }),
				}
			);
		} catch (err) {
			throw new CustomError('Failed to fetch themes', err, {
				schemaIdentifiers,
			});
		}
	}
}
