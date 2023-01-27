import { Avo } from '@viaa/avo2-types';

import { PickerItem } from '../../../types/content-picker';
import { parsePickerItem } from '../helpers/parse-picker';

import { ItemsService } from '~modules/item/items.service';
import { ContentPickerType } from '~shared/components/ContentPicker/ContentPicker.types';

// Fetch content items from GQL
export const retrieveItems = async (
	titleOrExternalId: string | null,
	limit = 5
): Promise<PickerItem[]> => {
	const items: Avo.Item.Item[] | null = titleOrExternalId
		? await ItemsService.fetchPublicItemsByTitleOrExternalId(titleOrExternalId, limit)
		: await ItemsService.fetchPublicItems(limit);

	return parseItems(items || []);
};

// Parse raw content items to react-select options
const parseItems = (raw: Avo.Item.Item[]): PickerItem[] => {
	return raw.map((item: Avo.Item.Item): PickerItem => {
		return {
			label: item.title,
			...parsePickerItem(ContentPickerType.ITEM, item.external_id.toString()),
		};
	});
};
