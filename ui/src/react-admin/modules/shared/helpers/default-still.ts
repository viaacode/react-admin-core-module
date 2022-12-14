import { Avo } from '@viaa/avo2-types';

import { DEFAULT_AUDIO_STILL } from '../consts/items.consts';
import { GetItemByExternalIdQuery, GetItemByUuidQuery } from '~generated/graphql-db-types-avo';

export const addDefaultAudioStillToItem = (
	item: Avo.Item.Item
): Avo.Item.Item => {
	if (item?.type?.label === 'audio') {
		return {
			...item,
			thumbnail_path: DEFAULT_AUDIO_STILL,
		} as unknown as Avo.Item.Item;
	}

	return item as unknown as Avo.Item.Item;
};
