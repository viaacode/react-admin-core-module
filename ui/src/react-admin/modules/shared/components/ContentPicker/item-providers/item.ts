import type { Avo } from '@viaa/avo2-types';

import type { PickerItem } from '~shared/types/content-picker';
import { parsePickerItem } from '../helpers/parse-picker';

import { ItemsService } from '~modules/item/items.service';
import memoize from 'memoizee';
import { MEMOIZEE_OPTIONS } from '~shared/consts/memoizee-options';

// Fetch content items from GQL
export const retrieveItems = memoize(
	async (titleOrExternalId: string | null, limit = 5): Promise<PickerItem[]> => {
		const items: Avo.Item.Item[] | null = titleOrExternalId
			? await ItemsService.fetchPublicItemsByTitleOrExternalId(titleOrExternalId, limit)
			: await ItemsService.fetchPublicItems(limit);

		return parseItems(items || []);
	},
	MEMOIZEE_OPTIONS
);

// Parse raw content items to react-select options
const parseItems = (raw: Avo.Item.Item[]): PickerItem[] => {
	return raw.map((item: Avo.Item.Item): PickerItem => {
		return {
			label: item.title,
			...parsePickerItem('ITEM', item.external_id.toString()),
		};
	});
};
