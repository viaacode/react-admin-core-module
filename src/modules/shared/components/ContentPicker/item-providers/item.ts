import { Avo } from '@viaa/avo2-types';

import { PickerSelectItem } from '../../../types/content-picker';
import { parsePickerItem } from '../helpers/parse-picker';

import { ItemsService } from 'modules/item/items.service';
import { ContentPickerType } from 'modules/shared/components/ContentPicker/ContentPicker.const';

// Fetch content items from GQL
export const retrieveItems = async (
	titleOrExternalId: string | null,
	limit = 5
): Promise<PickerSelectItem[]> => {
	const items: Avo.Item.Item[] | null = titleOrExternalId
		? await ItemsService.fetchPublicItemsByTitleOrExternalId(titleOrExternalId, limit)
		: await ItemsService.fetchPublicItems(limit);

	return parseItems(items || []);
};

// Parse raw content items to react-select options
const parseItems = (raw: Avo.Item.Item[]): PickerSelectItem[] => {
	return raw.map((item: Avo.Item.Item): PickerSelectItem => {
		return {
			label: item.title,
			value: parsePickerItem(ContentPickerType.ITEM, item.external_id.toString()),
		};
	});
};
