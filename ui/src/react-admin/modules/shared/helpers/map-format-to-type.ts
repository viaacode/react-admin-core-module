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
): SimpleIeObjectType | undefined {
	if (!format) {
		return undefined;
	}

	return MAP_DC_TERMS_FORMAT_TO_SIMPLE_TYPE[format] || format;
}
