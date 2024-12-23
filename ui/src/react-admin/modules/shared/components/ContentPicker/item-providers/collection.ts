import type { Avo } from '@viaa/avo2-types';

import { parsePickerItem } from '../helpers/parse-picker';

import { CollectionService } from '~modules/collection/collection.service';
import { ContentTypeNumber } from '~modules/collection/collection.types';
import type { PickerItem } from '~shared/types/content-picker';
import { MEMOIZEE_OPTIONS } from '~shared/consts/memoizee-options';
import memoize from 'memoizee';

// TODO: move fetchBundles and fetchBundlesByTitle to a separate bundle service, not collection service.

// fetch collections by title-wildcard
export const retrieveCollections = memoize(
	async (titleOrId: string | null, limit = 5): Promise<PickerItem[]> => {
		const collections: Avo.Collection.Collection[] | null = titleOrId
			? await CollectionService.fetchCollectionsByTitleOrId(titleOrId, limit)
			: await CollectionService.fetchCollectionsOrBundles(
					limit,
					ContentTypeNumber.collection
			  );

		return parseCollections('COLLECTION', collections || []);
	},
	MEMOIZEE_OPTIONS
);

// fetch bundles by title-wildcard
export const retrieveBundles = async (
	titleOrId: string | null,
	limit = 5
): Promise<PickerItem[]> => {
	const bundles: Avo.Collection.Collection[] | null = titleOrId
		? await CollectionService.fetchBundlesByTitleOrId(titleOrId, limit)
		: await CollectionService.fetchCollectionsOrBundles(limit, ContentTypeNumber.bundle);

	return parseCollections('BUNDLE', bundles || []);
};

// parse raw data to react-select options
const parseCollections = (
	type: Avo.Core.ContentPickerType,
	raw: Avo.Collection.Collection[]
): PickerItem[] => {
	return raw.map(
		(item: Avo.Collection.Collection): PickerItem => ({
			label: item.title,
			...parsePickerItem(type, item.id.toString()),
		})
	);
};
