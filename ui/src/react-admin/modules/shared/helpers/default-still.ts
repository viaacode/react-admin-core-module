import type { AvoItemItem } from '@viaa/avo2-types';
import { AdminConfigManager } from '~core/config/config.class';

export const addDefaultAudioStillToItem = (item: AvoItemItem): AvoItemItem => {
	if (item?.type?.label === 'audio') {
		return {
			...item,
			thumbnail_path: AdminConfigManager.getConfig().components.defaultAudioStill,
		} as unknown as AvoItemItem;
	}

	return item as unknown as AvoItemItem;
};
