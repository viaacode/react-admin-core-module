import type { IconName } from '@viaa/avo2-components';
import { IeObjectType } from '~shared/helpers/mapFormatToType.ts';

export function getIconFromObjectType(format: IeObjectType | undefined): IconName {
	switch (format) {
		case IeObjectType.film:
		case IeObjectType.video:
		case IeObjectType.videofragment:
			return 'no-video--light' as IconName;

		case IeObjectType.audio:
		case IeObjectType.audiofragment:
			return 'no-audio--light' as IconName;

		case IeObjectType.newspaper:
		case IeObjectType.newspaperpage:
			return 'no-newspaper--light' as IconName;

		case IeObjectType.image:
			return 'no-image--light' as IconName;

		default:
			return 'no-file--light' as IconName;
	}
}
