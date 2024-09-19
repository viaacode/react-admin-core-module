import type { IconName } from '@viaa/avo2-components';
import { AdminConfigManager } from '~core/config';

export function GET_TYPE_TO_ICON_MAP(): Record<string, IconName> {
	return {
		audio: AdminConfigManager.getConfig().icon?.componentProps.audio.name as IconName,
		video: AdminConfigManager.getConfig().icon?.componentProps.video.name as IconName,
		film: AdminConfigManager.getConfig().icon?.componentProps.video.name as IconName,
		noAudio: AdminConfigManager.getConfig().icon?.componentProps.noAudio.name as IconName,
		noVideo: AdminConfigManager.getConfig().icon?.componentProps.noVideo.name as IconName,
		noFilm: AdminConfigManager.getConfig().icon?.componentProps.noVideo.name as IconName,
	};
}
