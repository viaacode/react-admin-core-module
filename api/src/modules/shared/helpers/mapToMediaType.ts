import { ContentTypeNumber } from '../../collections';

/**
 * Converts the AVO item type id or Het Archief dctermsFormat to a simple value
 *
 * @param type
 */
export function mapToMediaType(type: ContentTypeNumber | string): 'audio' | 'video' | 'other' {
	switch (type) {
		case ContentTypeNumber.audio:
		case 'audio':
		case 'audiofragment':
			return 'audio';

		case ContentTypeNumber.video:
		case 'video':
		case 'videofragment':
		case 'film':
			return 'video';

		default:
			return 'other';
	}
}
