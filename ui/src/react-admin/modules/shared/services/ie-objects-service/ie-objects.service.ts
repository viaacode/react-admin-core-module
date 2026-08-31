import { stringifyUrl } from 'query-string';
import { CustomError } from '~shared/helpers/custom-error';
import { fetchWithLogout, fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getProxyUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import type {
	IeObject,
	PlayableDisplayIeObject,
	UnsavedPlayableDisplayDataObject,
} from '~shared/services/ie-objects-service/ie-objects.types.ts';

export class IeObjectsService {
	private static getBaseUrl(): string {
		return `${getProxyUrl()}/ie-objects`;
	}

	/**
	 * Playable display data cannot carry a newspaper's page list, so a caller needing the object
	 * itself -- the IIIF viewer does -- asks here.
	 */
	public static async getIeObjectsByIds(schemaIdentifiers: string[]): Promise<IeObject[]> {
		const url = stringifyUrl({
			url: IeObjectsService.getBaseUrl(),
			// Without this the thumbnail comes back as a path the browser cannot load.
			query: { schemaIdentifiers, resolveThumbnailUrl: 'true' },
		});
		try {
			return (await fetchWithLogoutJson<IeObject[]>(url)) || [];
		} catch (err) {
			throw new CustomError('Failed to fetch ie-objects by id', err, { schemaIdentifiers });
		}
	}

	/**
	 * A file's stored url is useless on its own: the media server wants a short-lived, per-visitor
	 * ticket in the Authorization header. The endpoint answers as plain text, not JSON.
	 */
	public static async getPlayableUrl(
		fileId: string,
		schemaIdentifier: string
	): Promise<string | null> {
		const url = stringifyUrl({
			url: `${IeObjectsService.getBaseUrl()}/player-ticket`,
			query: { fileId, schemaIdentifier },
		});
		try {
			const response = await fetchWithLogout(url);
			return response.ok ? await response.text() : null;
		} catch (err) {
			throw new CustomError('Failed to fetch a playable url for an ie-object file', err, {
				fileId,
				schemaIdentifier,
			});
		}
	}

	/**
	 * Fetches the playable display data for the ie-objects referenced by a content block.
	 *
	 * The objects -- and the snippet start/end times they are cut at -- are read from the stored
	 * block config by the proxy, so they cannot be tampered with here. The response holds one
	 * (possibly null) entry per element of the block, in the block's own order: an element that
	 * has no ie-object selected, or one the visitor has no access to, comes back as null.
	 *
	 * A block rendered in the content page editor has no id to look up: its config is being changed
	 * as we speak, and a freshly added block was never saved. Those pass their objects directly
	 * instead; the proxy only honours them for users who may edit content pages, and ignores them
	 * for anyone else. Exactly one of the two goes out per request -- the endpoint rejects a body
	 * carrying both.
	 */
	public static async getPlayableDisplayData(
		blockId: string | undefined,
		unsavedObjects?: UnsavedPlayableDisplayDataObject[]
	): Promise<(PlayableDisplayIeObject | null)[]> {
		const body = blockId ? { blockId } : { objects: unsavedObjects };
		try {
			return await fetchWithLogoutJson<(PlayableDisplayIeObject | null)[]>(
				`${IeObjectsService.getBaseUrl()}/playable-display-data`,
				{
					method: 'POST',
					body: JSON.stringify(body),
				}
			);
		} catch (err) {
			throw new CustomError('Failed to fetch playable display data for content block', err, {
				blockId,
				unsavedObjects,
			});
		}
	}
}
