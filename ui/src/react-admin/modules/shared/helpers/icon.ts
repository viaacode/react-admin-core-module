import { AdminCoreIconName } from '~core/config/config.types';
import { IeObjectType } from '~shared/helpers/mapFormatToType.ts';

/**
 * Icon for an object type. Mirrors the client's `getIconFromObjectType`
 * (hetarchief-client/src/modules/shared/components/MediaCard/MediaCard.consts.ts):
 * when the essence is available to the user, we show the plain icon, otherwise the
 * struck-through ("no-…") variant.
 */
export function getIconFromObjectType(
	format: IeObjectType | undefined,
	accessible: boolean
): AdminCoreIconName {
	switch (format) {
		case IeObjectType.film:
		case IeObjectType.video:
		case IeObjectType.videofragment:
			return accessible ? AdminCoreIconName.Video : AdminCoreIconName.NoVideo;

		case IeObjectType.audio:
		case IeObjectType.audiofragment:
			return accessible ? AdminCoreIconName.Audio : AdminCoreIconName.NoAudio;

		case IeObjectType.newspaper:
		case IeObjectType.newspaperpage:
			return accessible ? AdminCoreIconName.Newspaper : AdminCoreIconName.NoNewspaper;

		case IeObjectType.image:
			return accessible ? AdminCoreIconName.Image : AdminCoreIconName.NoImage;

		default:
			return accessible ? AdminCoreIconName.File : AdminCoreIconName.NoFile;
	}
}
