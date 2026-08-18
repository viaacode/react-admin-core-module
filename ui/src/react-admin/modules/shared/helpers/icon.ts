import type { IconName } from '@viaa/avo2-components';
import { IeObjectType } from '~shared/helpers/mapFormatToType.ts';

/**
 * Icon for an object type. Mirrors the client's `getIconFromObjectType`
 * (hetarchief-client/src/modules/shared/components/MediaCard/MediaCard.consts.ts):
 * when the essence is available to the user we show the plain icon, otherwise the
 * struck-through ("no-…") variant.
 */
export function getIconFromObjectType(
	format: ObjectType | undefined,
	accessible: boolean
): IconName {
	switch (format) {
		case ObjectType.film:
		case ObjectType.video:
		case ObjectType.videofragment:
			return (accessible ? 'video--light' : 'no-video--light') as IconName;

		case ObjectType.audio:
		case ObjectType.audiofragment:
			return (accessible ? 'audio--light' : 'no-audio--light') as IconName;

		case ObjectType.newspaper:
		case ObjectType.newspaperpage:
			return (accessible ? 'newspaper--light' : 'no-newspaper--light') as IconName;

		case ObjectType.image:
			return (accessible ? 'image--light' : 'no-image--light') as IconName;

		default:
			return (accessible ? 'file--light' : 'no-file--light') as IconName;
	}
}
