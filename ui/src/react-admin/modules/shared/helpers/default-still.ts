import type { Avo } from '@viaa/avo2-types';
import { AdminConfigManager } from '~core/config';

export const addDefaultAudioStillToItem = (item: Avo.Item.Item): Avo.Item.Item => {
	if (item?.type?.label === 'audio') {
		return {
			...item,
			thumbnail_path: AdminConfigManager.getConfig().components.defaultAudioStill,
		} as unknown as Avo.Item.Item;
	}

	return item as unknown as Avo.Item.Item;
};
