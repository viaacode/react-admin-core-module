import type { IconName } from '@viaa/avo2-components';
import {
	mapDcTermsFormatToSimpleType,
	type ObjectType,
	SimpleIeObjectType,
} from '~shared/helpers/map-format-to-type.ts';

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
	const simpleType = mapDcTermsFormatToSimpleType(format);

	switch (simpleType) {
		case SimpleIeObjectType.VIDEO:
			return (accessible ? 'video--light' : 'no-video--light') as IconName;

		case SimpleIeObjectType.AUDIO:
			return (accessible ? 'audio--light' : 'no-audio--light') as IconName;

		case SimpleIeObjectType.NEWSPAPER:
			return (accessible ? 'newspaper--light' : 'no-newspaper--light') as IconName;

		case SimpleIeObjectType.IMAGE:
			return (accessible ? 'image--light' : 'no-image--light') as IconName;

		default:
			return (accessible ? 'file--light' : 'no-file--light') as IconName;
	}
}
