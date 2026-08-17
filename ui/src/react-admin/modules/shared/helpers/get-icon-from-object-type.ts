import type { IconName } from '@viaa/avo2-components';
import { ObjectType } from '~shared/helpers/map-format-to-type.ts';

export function getIconFromObjectType(
	format: ObjectType | undefined,
	inaccessible: boolean
): IconName {
	switch (format) {
		case ObjectType.film:
		case ObjectType.video:
		case ObjectType.videofragment:
			return (inaccessible ? 'no-video--light' : 'video--light') as IconName;

		case ObjectType.audio:
		case ObjectType.audiofragment:
			return (inaccessible ? 'no-audio--light' : 'audio--light') as IconName;

		case ObjectType.newspaper:
		case ObjectType.newspaperpage:
			return (inaccessible ? 'no-newspaper--light' : 'newspaper--light') as IconName;

		case ObjectType.image:
			return (inaccessible ? 'no-image--light' : 'image--light') as IconName;

		default:
			return (inaccessible ? 'no-file--light' : 'file--light') as IconName;
	}
}
