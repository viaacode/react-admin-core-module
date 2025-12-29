import { AvoCoreContentPickerType, type AvoItemItem } from '@viaa/avo2-types';
import memoize from 'memoizee';
import { ItemsService } from '~modules/item/items.service';
import { MEMOIZEE_OPTIONS } from '~shared/consts/memoizee-options';
import type { PickerItem } from '~shared/types/content-picker';
import { parsePickerItem } from '../helpers/parse-picker';

// Fetch content items from GQL
export const retrieveItems = memoize(
	async (titleOrExternalId: string | null, limit = 5): Promise<PickerItem[]> => {
		const items: AvoItemItem[] | null = titleOrExternalId
			? await ItemsService.fetchPublicItemsByTitleOrExternalId(titleOrExternalId, limit)
			: await ItemsService.fetchPublicItems(limit);

		return parseItems(items || []);
	},
	MEMOIZEE_OPTIONS
);

// Parse raw content items to react-select options
const parseItems = (raw: AvoItemItem[]): PickerItem[] => {
	return raw.map((item: AvoItemItem): PickerItem => {
		return {
			label: item.title,
			...parsePickerItem(AvoCoreContentPickerType.ITEM, item.external_id.toString()),
		};
	});
};
