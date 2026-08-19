import { AdminCoreIconName } from '~core/config/config.types';
import { ObjectType } from '~shared/helpers/mapFormatToType.ts';

/**
 * Icon for an object type. Mirrors the client's `getIconFromObjectType`
 * (hetarchief-client/src/modules/shared/components/MediaCard/MediaCard.consts.ts):
 * when the essence is available to the user we show the plain icon, otherwise the
 * struck-through ("no-…") variant.
 */
export function getIconFromObjectType(
	format: ObjectType | undefined,
	accessible: boolean
): AdminCoreIconName {
	switch (format) {
		case ObjectType.film:
		case ObjectType.video:
		case ObjectType.videofragment:
			return accessible ? AdminCoreIconName.Video : AdminCoreIconName.NoVideo;

		case ObjectType.audio:
		case ObjectType.audiofragment:
			return accessible ? AdminCoreIconName.Audio : AdminCoreIconName.NoAudio;

		case ObjectType.newspaper:
		case ObjectType.newspaperpage:
			return accessible ? AdminCoreIconName.Newspaper : AdminCoreIconName.NoNewspaper;

		case ObjectType.image:
			return accessible ? AdminCoreIconName.Image : AdminCoreIconName.NoImage;

		default:
			return accessible ? AdminCoreIconName.File : AdminCoreIconName.NoFile;
	}
}
