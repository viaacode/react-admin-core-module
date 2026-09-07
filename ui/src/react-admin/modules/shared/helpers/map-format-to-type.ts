import { HetArchiefIeObjectType, HetArchiefSimpleIeObjectType } from '@viaa/avo2-types';

const MAP_DC_TERMS_FORMAT_TO_SIMPLE_TYPE: Record<
	HetArchiefIeObjectType,
	HetArchiefSimpleIeObjectType
> = {
	[HetArchiefIeObjectType.VIDEO]: HetArchiefSimpleIeObjectType.VIDEO,
	[HetArchiefIeObjectType.VIDEO_FRAGMENT]: HetArchiefSimpleIeObjectType.VIDEO,
	[HetArchiefIeObjectType.FILM]: HetArchiefSimpleIeObjectType.VIDEO,
	[HetArchiefIeObjectType.AUDIO]: HetArchiefSimpleIeObjectType.AUDIO,
	[HetArchiefIeObjectType.AUDIO_FRAGMENT]: HetArchiefSimpleIeObjectType.AUDIO,
	[HetArchiefIeObjectType.NEWSPAPER]: HetArchiefSimpleIeObjectType.NEWSPAPER,
	[HetArchiefIeObjectType.NEWSPAPER_PAGE]: HetArchiefSimpleIeObjectType.NEWSPAPER,
	[HetArchiefIeObjectType.IMAGE]: HetArchiefSimpleIeObjectType.IMAGE,
};

export function mapDcTermsFormatToSimpleType(
	format: HetArchiefIeObjectType | undefined | null
): HetArchiefSimpleIeObjectType | undefined {
	if (!format) {
		return undefined;
	}

	return MAP_DC_TERMS_FORMAT_TO_SIMPLE_TYPE[format] || format;
}
