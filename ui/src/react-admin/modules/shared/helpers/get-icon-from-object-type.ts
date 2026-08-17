import type { IconName } from '@viaa/avo2-components';
import { ObjectType } from '~shared/helpers/map-format-to-type.ts';

export function getIconFromObjectType(format: ObjectType | undefined): IconName {
	switch (format) {
		case ObjectType.film:
		case ObjectType.video:
		case ObjectType.videofragment:
			return 'no-video--light' as IconName;

		case ObjectType.audio:
		case ObjectType.audiofragment:
			return 'no-audio--light' as IconName;

		case ObjectType.newspaper:
		case ObjectType.newspaperpage:
			return 'no-newspaper--light' as IconName;

		case ObjectType.image:
			return 'no-image--light' as IconName;

		default:
			return 'no-file--light' as IconName;
	}
}
