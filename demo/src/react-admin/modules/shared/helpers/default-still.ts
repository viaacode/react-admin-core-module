import { Avo } from '@viaa/avo2-types';
import { get } from 'lodash-es';

import { DEFAULT_AUDIO_STILL } from '../consts/items.consts';

export const addDefaultAudioStillToItem = (item: Avo.Item.Item) => {
	if (get(item, 'type.label') === 'audio') {
		return {
			...item,
			thumbnail_path: DEFAULT_AUDIO_STILL,
		};
	}

	return item;
};
