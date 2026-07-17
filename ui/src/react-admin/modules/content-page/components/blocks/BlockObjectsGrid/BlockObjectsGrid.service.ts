import { stringifyUrl } from 'query-string';
import { CustomError } from '~shared/helpers/custom-error';
import { fetchWithLogout, fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getProxyUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import type { PickerItem } from '~shared/types/content-picker';
import {
	FILTER_LABEL_VALUE_DELIMITER,
	IeObjectsSearchFilterField,
	IeObjectsSearchOperator,
	mapAdvancedFilterParamToElastic,
	type SearchFilter,
} from './BlockObjectsGrid.search-filters';
import { type ObjectsGridItem, ObjectsGridItemType } from './BlockObjectsGrid.types';

/**
 * How many query-result objects to request. The grid shows 4 rows and the number of columns
 * is responsive (see the FA), so we fetch enough to fill the widest layout; the grid clamps
 * what is actually rendered via CSS.
 */
export const DEFAULT_OBJECTS_GRID_LIMIT = 24;

interface IeObjectsSearchBody {
	filters: SearchFilter[];
	size: number;
	page: number;
}

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

const stripLabel = (value: string): string => value.split(FILTER_LABEL_VALUE_DELIMITER)[0];

/**
 * Convert a raw hetarchief.be `/zoeken` search URL into the ie-objects search body.
 *
 * Mirrors the client-side `mapFiltersToElastic` (hetarchief-client visitor-space/utils/elastic-filters):
 * each search-page url param is translated to the matching API filter field/operator. The advanced
 * range params (`duration`, `releaseDate`, `advanced`) are decoded via the ported advanced-filter
 * logic in `BlockObjectsGrid.search-filters.ts`.
 */
export const parseSearchQueryToSearchBody = (
	searchQuery: string,
	size: number
): IeObjectsSearchBody => {
	const filters: SearchFilter[] = [];
	// The API pagination is 1-based (default 1), same as the hetarchief search url.
	let page = 1;

	const add = (filter: SearchFilter) => {
		if (filter.value || filter.multiValue?.length) {
			filters.push(filter);
		}
	};

	try {
		const params = new URL(searchQuery).searchParams;
		const single = (key: string) => params.get(key) || '';
		const multi = (key: string) => params.getAll(key).filter(Boolean);

		const pageParam = Number(params.get('page'));
		if (Number.isFinite(pageParam) && pageParam > 0) {
			page = pageParam;
		}

		// Free-text search terms (searchbar) → query / contains.
		for (const term of multi('zoekterm')) {
			add({
				field: IeObjectsSearchFilterField.QUERY,
				operator: IeObjectsSearchOperator.CONTAINS,
				value: term,
			});
		}

		// Media type tab → format / is ("all" means no filter).
		const format = single('format');
		if (format && format !== 'all') {
			add({
				field: IeObjectsSearchFilterField.FORMAT,
				operator: IeObjectsSearchOperator.IS,
				value: format,
			});
		}

		add({
			field: IeObjectsSearchFilterField.MEDIUM,
			operator: IeObjectsSearchOperator.IS,
			multiValue: multi('medium'),
		});
		add({
			field: IeObjectsSearchFilterField.CREATOR,
			operator: IeObjectsSearchOperator.CONTAINS,
			value: single('creator'),
		});
		add({
			field: IeObjectsSearchFilterField.NEWSPAPER_SERIES_NAME,
			operator: IeObjectsSearchOperator.IS,
			value: single('newspaperSeriesName'),
		});
		add({
			field: IeObjectsSearchFilterField.LOCATION_CREATED,
			operator: IeObjectsSearchOperator.IS,
			value: single('locationCreated'),
		});
		add({
			field: IeObjectsSearchFilterField.MENTIONS,
			operator: IeObjectsSearchOperator.IS,
			value: single('mentions'),
		});
		add({
			field: IeObjectsSearchFilterField.GENRE,
			operator: IeObjectsSearchOperator.IS,
			multiValue: multi('genre'),
		});
		add({
			field: IeObjectsSearchFilterField.KEYWORD,
			operator: IeObjectsSearchOperator.IS,
			multiValue: multi('keywords'),
		});
		add({
			field: IeObjectsSearchFilterField.LANGUAGE,
			operator: IeObjectsSearchOperator.IS,
			multiValue: multi('language').map(stripLabel),
		});
		// `aanbieders` (maintainers) → maintainer / is, values encoded as `OR-id---label`.
		add({
			field: IeObjectsSearchFilterField.MAINTAINER_ID,
			operator: IeObjectsSearchOperator.IS,
			multiValue: multi('aanbieders').map(stripLabel),
		});
		add({
			field: IeObjectsSearchFilterField.REUSABILITY,
			operator: IeObjectsSearchOperator.IS,
			multiValue: multi('herbruikbaarheid').map(stripLabel),
		});
		if (single('onLocation')) {
			add({
				field: IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION,
				operator: IeObjectsSearchOperator.IS,
				value: 'true',
			});
		}
		if (single('media')) {
			add({
				field: IeObjectsSearchFilterField.CONSULTABLE_MEDIA,
				operator: IeObjectsSearchOperator.IS,
				value: 'true',
			});
		}
		if (single('publicDomain')) {
			add({
				field: IeObjectsSearchFilterField.CONSULTABLE_PUBLIC_DOMAIN,
				operator: IeObjectsSearchOperator.IS,
				value: 'true',
			});
		}

		// Advanced range filters (duration / releaseDate / free-form advanced), acronym-encoded in the url.
		for (const key of ['duration', 'releaseDate', 'advanced']) {
			for (const filter of mapAdvancedFilterParamToElastic(params.get(key))) {
				add(filter);
			}
		}
	} catch {
		// Invalid URL (already blocked by the editor validator) → return an empty search.
	}

	return { filters, size, page };
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
