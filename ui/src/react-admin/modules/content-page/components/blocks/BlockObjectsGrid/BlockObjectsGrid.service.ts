import { stringifyUrl } from 'query-string';
import { AdminConfigManager } from '~core/config/config.class';
import type { IeObjectsSearchBody } from '~core/config/config.types';
import { CustomError } from '~shared/helpers/custom-error';
import { fetchWithLogout, fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getProxyUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import type { PickerItem } from '~shared/types/content-picker';
import { type ObjectsGridItem, ObjectsGridItemType } from './BlockObjectsGrid.types';

/**
 * How many query-result objects to request. The grid shows 4 rows and the number of columns
 * is responsive (see the FA), so we fetch enough to fill the widest layout; the grid clamps
 * what is actually rendered via CSS.
 */
export const DEFAULT_OBJECTS_GRID_LIMIT = 24;

/**
 * Shape of a single item as returned by both `POST /ie-objects` (search, in `.items`) and
 * `GET /ie-objects?schemaIdentifiers=…` (array). Only the fields the grid needs are declared.
 */
interface RawIeObject {
	schemaIdentifier: string;
	name?: string;
	maintainerName?: string;
	// dcterms format, e.g. "video" | "audio" | "newspaper".
	dctermsFormat?: string;
	thumbnailUrl?: string;
}

const mapFormatToType = (format?: string): ObjectsGridItemType | undefined => {
	switch ((format || '').toLowerCase()) {
		case 'video':
		case 'film':
			return ObjectsGridItemType.Video;
		case 'audio':
			return ObjectsGridItemType.Audio;
		case 'newspaper':
		case 'krant':
			return ObjectsGridItemType.Newspaper;
		case 'image':
		case 'photo':
			return ObjectsGridItemType.Image;
		default:
			return undefined;
	}
};

const mapRawToGridItem = (raw: RawIeObject): ObjectsGridItem => ({
	schemaIdentifier: raw.schemaIdentifier,
	name: raw.name || '',
	maintainerName: raw.maintainerName,
	type: mapFormatToType(raw.dctermsFormat),
	thumbnailUrl: raw.thumbnailUrl,
});

/**
 * Convert a raw hetarchief.be `/zoeken` search URL into the ie-objects search body.
 *
 * The actual url-param-to-filter mapping logic lives client-side (it mirrors the search page's
 * own filter logic, which the admin-core cannot import — the client depends on the admin-core,
 * not the other way around), and is passed in through the admin-core config as
 * `services.search.searchUrlToApiUrl`.
 */
export const parseSearchQueryToSearchBody = (
	searchQuery: string,
	size: number
): IeObjectsSearchBody => {
	const clientSearchUrlToApiSearchUrl =
		AdminConfigManager.getConfig().services.search?.clientSearchUrlToApiSearchUrl;
	if (!clientSearchUrlToApiSearchUrl) {
		return { filters: [], size, page: 1 };
	}
	return clientSearchUrlToApiSearchUrl(searchQuery, size);
};

const searchIeObjects = async (body: IeObjectsSearchBody): Promise<ObjectsGridItem[]> => {
	const response: { items?: RawIeObject[] } = await fetchWithLogoutJson(
		`${getProxyUrl()}/ie-objects`,
		{
			method: 'POST',
			body: JSON.stringify(body),
		}
	);
	return (response.items || []).map(mapRawToGridItem);
};

/**
 * Resolve the pinned "fixed position" objects (by their schemaIdentifier / pid) to full objects,
 * in a single `GET /ie-objects?schemaIdentifiers=…` call, preserving the admin-configured order.
 */
const getFixedObjects = async (fixedItems: PickerItem[]): Promise<ObjectsGridItem[]> => {
	const identifiers = fixedItems.map((item) => item.value).filter(Boolean);

	if (identifiers.length === 0) {
		return [];
	}

	const url = stringifyUrl({
		url: `${getProxyUrl()}/ie-objects`,
		query: { schemaIdentifiers: identifiers, resolveThumbnailUrl: 'true' },
	});
	const response = await fetchWithLogout(url);
	const raw: RawIeObject[] = response.ok ? await response.json() : [];
	const bySchemaIdentifier = new Map(raw.map((item) => [item.schemaIdentifier, item]));

	// Keep the admin-configured order, drop identifiers that resolved to nothing.
	return identifiers
		.map((id) => bySchemaIdentifier.get(id))
		.filter((item): item is RawIeObject => Boolean(item))
		.map(mapRawToGridItem);
};

export interface ObjectsGridData {
	fixedObjects: ObjectsGridItem[];
	objects: ObjectsGridItem[];
}

export const getObjectsGridItems = async (
	searchQuery: string,
	fixedItems: PickerItem[],
	limit = DEFAULT_OBJECTS_GRID_LIMIT
): Promise<ObjectsGridData> => {
	try {
		const [fixedObjects, objects] = await Promise.all([
			getFixedObjects(fixedItems),
			searchQuery
				? searchIeObjects(parseSearchQueryToSearchBody(searchQuery, limit))
				: Promise.resolve([]),
		]);

		// Don't show the same object twice if it is both pinned and returned by the query.
		const fixedIds = new Set(fixedObjects.map((item) => item.schemaIdentifier));
		return {
			fixedObjects,
			objects: objects.filter((item) => !fixedIds.has(item.schemaIdentifier)),
		};
	} catch (err) {
		throw new CustomError('Failed to fetch objects for the objects-grid block', err, {
			searchQuery,
			fixedItems,
			limit,
		});
	}
};
