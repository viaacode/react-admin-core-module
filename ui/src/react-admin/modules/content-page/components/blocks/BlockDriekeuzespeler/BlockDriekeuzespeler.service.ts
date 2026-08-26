import { stringifyUrl } from 'query-string';
import { AdminConfigManager } from '~core/config/config.class';
import { CustomError } from '~shared/helpers/custom-error';
import { fetchWithLogout } from '~shared/helpers/fetch-with-logout';
import { getProxyUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import { isAudioFormat } from '~shared/helpers/is-audio-video-format.ts';
import type { IeObjectType } from '~shared/helpers/map-format-to-type';

/**
 * Shape of one item as `GET /ie-objects?schemaIdentifiers=…` returns it. Only the fields a tile
 * needs are declared.
 */
interface RawIeObject {
	schemaIdentifier: string;
	name?: string;
	maintainerName?: string;
	dctermsFormat?: IeObjectType;
	thumbnailUrl?: string;
}

/** One resolved object behind a tile. */
export interface DriekeuzespelerObject {
	schemaIdentifier: string;
	name: string;
	maintainerName?: string;
	type?: IeObjectType;
	thumbnailUrl?: string;
}

const mapRawToObject = (raw: RawIeObject): DriekeuzespelerObject => ({
	schemaIdentifier: raw.schemaIdentifier,
	name: raw.name || '',
	maintainerName: raw.maintainerName,
	type: raw.dctermsFormat,
	// Audio has no image of its own, so it falls back to the shared audio still, exactly as the
	// objects-grid block does.
	thumbnailUrl: isAudioFormat(raw.dctermsFormat)
		? AdminConfigManager.getConfig().components.defaultAudioStill
		: raw.thumbnailUrl,
});

/**
 * Resolves the objects for the tiles that are on screen: name, maintainer, format and thumbnail.
 *
 * This is deliberately the light `GET /ie-objects` route and not `playable-display-data`. The block
 * can hold up to 200 interests but shows three, and the playable route resolves every element a
 * block references -- including signed play urls, audio waveforms and base64 newspaper images. Only
 * the modal needs any of that, and only for the one object the visitor opened.
 *
 * Returns a map keyed by schemaIdentifier. Ids that resolve to nothing -- removed objects, or
 * objects this visitor may not see -- are simply absent, so the caller decides what to do with the
 * tile. https://meemoo.atlassian.net/wiki/spaces/HA2/pages/6218383419
 *
 * Expects the ids to be filled in already; the hook drops the empty ones so its query key matches
 * what is fetched.
 */
export const getDriekeuzespelerObjects = async (
	schemaIdentifiers: string[]
): Promise<Record<string, DriekeuzespelerObject>> => {
	if (schemaIdentifiers.length === 0) {
		return {};
	}

	try {
		const url = stringifyUrl({
			url: `${getProxyUrl()}/ie-objects`,
			query: { schemaIdentifiers, resolveThumbnailUrl: 'true' },
		});
		const response = await fetchWithLogout(url);
		const raw: RawIeObject[] = response.ok ? await response.json() : [];

		return Object.fromEntries(raw.map((item) => [item.schemaIdentifier, mapRawToObject(item)]));
	} catch (err) {
		throw new CustomError('Failed to fetch the objects for the driekeuzespeler block', err, {
			schemaIdentifiers,
		});
	}
};
