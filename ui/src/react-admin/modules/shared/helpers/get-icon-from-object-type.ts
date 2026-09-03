import {
	type HetArchiefIeObjectType as IeObjectType,
	HetArchiefSimpleIeObjectType as SimpleIeObjectType,
} from '@viaa/avo2-types';
import { AdminCoreIconName } from '~core/config/config.types';
import { mapDcTermsFormatToSimpleType } from '~shared/helpers/map-format-to-type.ts';

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
	const simpleType = mapDcTermsFormatToSimpleType(format);

	switch (simpleType) {
		case SimpleIeObjectType.VIDEO:
			return accessible ? AdminCoreIconName.Video : AdminCoreIconName.NoVideo;

		case SimpleIeObjectType.AUDIO:
			return accessible ? AdminCoreIconName.Audio : AdminCoreIconName.NoAudio;

		case SimpleIeObjectType.NEWSPAPER:
			return accessible ? AdminCoreIconName.Newspaper : AdminCoreIconName.NoNewspaper;

		case SimpleIeObjectType.IMAGE:
			return accessible ? AdminCoreIconName.Image : AdminCoreIconName.NoImage;

		default:
			return accessible ? AdminCoreIconName.File : AdminCoreIconName.NoFile;
	}
}
