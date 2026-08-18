export enum ObjectType {
	audio = 'audio',
	audiofragment = 'audiofragment',
	film = 'film',
	image = 'image',
	newspaper = 'newspaper',
	newspaperpage = 'newspaperpage',
	video = 'video',
	videofragment = 'videofragment',
}

export enum SimpleIeObjectType {
	VIDEO = 'video',
	AUDIO = 'audio',
	NEWSPAPER = 'newspaper',
	IMAGE = 'image',
}

const MAP_DC_TERMS_FORMAT_TO_SIMPLE_TYPE: Record<ObjectType, SimpleIeObjectType> = {
	[ObjectType.video]: SimpleIeObjectType.VIDEO,
	[ObjectType.videofragment]: SimpleIeObjectType.VIDEO,
	[ObjectType.film]: SimpleIeObjectType.VIDEO,
	[ObjectType.audio]: SimpleIeObjectType.AUDIO,
	[ObjectType.audiofragment]: SimpleIeObjectType.AUDIO,
	[ObjectType.newspaper]: SimpleIeObjectType.NEWSPAPER,
	[ObjectType.newspaperpage]: SimpleIeObjectType.NEWSPAPER,
	[ObjectType.image]: SimpleIeObjectType.IMAGE,
};

export function mapDcTermsFormatToSimpleType(
	format: ObjectType | undefined | null
): SimpleIeObjectType | 'unknown' {
	if (!format) {
		return 'unknown';
	}

	return MAP_DC_TERMS_FORMAT_TO_SIMPLE_TYPE[format] || format;
}

export function mapFormatToType(format?: string): ObjectType | undefined {
	switch ((format || '').toLowerCase()) {
		case 'video':
		case 'film':
			return ObjectType.video;
		case 'audio':
			return ObjectType.audio;
		case 'newspaper':
		case 'krant':
			return ObjectType.newspaper;
		case 'image':
		case 'photo':
			return ObjectType.image;
		default:
			return undefined;
	}
}
