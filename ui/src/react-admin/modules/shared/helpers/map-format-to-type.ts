import {
	HetArchiefIeObjectType as IeObjectType,
	HetArchiefSimpleIeObjectType as SimpleIeObjectType,
} from '@viaa/avo2-types';

const MAP_DC_TERMS_FORMAT_TO_SIMPLE_TYPE: Record<IeObjectType, SimpleIeObjectType> = {
	[IeObjectType.VIDEO]: SimpleIeObjectType.VIDEO,
	[IeObjectType.VIDEO_FRAGMENT]: SimpleIeObjectType.VIDEO,
	[IeObjectType.FILM]: SimpleIeObjectType.VIDEO,
	[IeObjectType.AUDIO]: SimpleIeObjectType.AUDIO,
	[IeObjectType.AUDIO_FRAGMENT]: SimpleIeObjectType.AUDIO,
	[IeObjectType.NEWSPAPER]: SimpleIeObjectType.NEWSPAPER,
	[IeObjectType.NEWSPAPER_PAGE]: SimpleIeObjectType.NEWSPAPER,
	[IeObjectType.IMAGE]: SimpleIeObjectType.IMAGE,
};

export function mapDcTermsFormatToSimpleType(
	format: IeObjectType | undefined | null
): SimpleIeObjectType | undefined {
	if (!format) {
		return undefined;
	}

	return MAP_DC_TERMS_FORMAT_TO_SIMPLE_TYPE[format] || format;
}
