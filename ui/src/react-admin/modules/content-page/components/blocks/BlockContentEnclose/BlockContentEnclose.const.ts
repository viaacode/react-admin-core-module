import { AdminConfigManager } from '~core/config';

export const TYPE_TO_ICON_MAP: Record<string, string> = {
	audio: AdminConfigManager.getConfig().icon?.componentProps.audio.name as string,
	video: AdminConfigManager.getConfig().icon?.componentProps.video.name as string,
	film: AdminConfigManager.getConfig().icon?.componentProps.video.name as string,
};
