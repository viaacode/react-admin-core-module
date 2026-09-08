import { type HetArchiefIeObjectType, HetArchiefSimpleIeObjectType } from '@viaa/avo2-types';
import { mapDcTermsFormatToSimpleType } from '~shared/helpers/map-format-to-type.ts';

export function isAudioType(format: HetArchiefIeObjectType | undefined | null): boolean {
	const simpleType = mapDcTermsFormatToSimpleType(format);
	return simpleType === HetArchiefSimpleIeObjectType.AUDIO;
}

export function isVideoType(format: HetArchiefIeObjectType | undefined | null): boolean {
	const simpleType = mapDcTermsFormatToSimpleType(format);
	return simpleType === HetArchiefSimpleIeObjectType.VIDEO;
}

export function isAudioVideoType(format: HetArchiefIeObjectType | undefined | null): boolean {
	return isAudioType(format) || isVideoType(format);
}

export function isNewspaperType(format: HetArchiefIeObjectType | undefined | null): boolean {
	return mapDcTermsFormatToSimpleType(format) === HetArchiefSimpleIeObjectType.NEWSPAPER;
}
