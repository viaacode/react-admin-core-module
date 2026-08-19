export enum IeObjectType {
	audio = 'audio',
	audiofragment = 'audiofragment',
	film = 'film',
	image = 'image', // Should never be used, but does seem to pop up some times
	newspaper = 'newspaper',
	newspaperpage = 'newspaperpage', // Should never be used, but does seem to pop up some times
	video = 'video',
	videofragment = 'videofragment',
}

export enum SimpleIeObjectType {
	VIDEO = 'video',
	AUDIO = 'audio',
	NEWSPAPER = 'newspaper',
	IMAGE = 'image',
}

const MAP_DC_TERMS_FORMAT_TO_SIMPLE_TYPE: Record<IeObjectType, SimpleIeObjectType> = {
	[IeObjectType.video]: SimpleIeObjectType.VIDEO,
	[IeObjectType.videofragment]: SimpleIeObjectType.VIDEO,
	[IeObjectType.film]: SimpleIeObjectType.VIDEO,
	[IeObjectType.audio]: SimpleIeObjectType.AUDIO,
	[IeObjectType.audiofragment]: SimpleIeObjectType.AUDIO,
	[IeObjectType.newspaper]: SimpleIeObjectType.NEWSPAPER,
	[IeObjectType.newspaperpage]: SimpleIeObjectType.NEWSPAPER,
	[IeObjectType.image]: SimpleIeObjectType.IMAGE,
};

export function mapDcTermsFormatToSimpleType(
	format: IeObjectType | undefined | null
): SimpleIeObjectType | 'unknown' {
	if (!format) {
		return 'unknown';
	}

	return MAP_DC_TERMS_FORMAT_TO_SIMPLE_TYPE[format] || format;
}

export function mapFormatToType(format?: string): IeObjectType | undefined {
	switch ((format || '').toLowerCase()) {
		case 'video':
		case 'film':
			return IeObjectType.video;
		case 'audio':
			return IeObjectType.audio;
		case 'newspaper':
		case 'krant':
			return IeObjectType.newspaper;
		case 'image':
		case 'photo':
			return IeObjectType.image;
		default:
			return undefined;
	}
}
