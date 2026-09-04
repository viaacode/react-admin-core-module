import { type HetArchiefIeObjectType, HetArchiefSimpleIeObjectType } from '@viaa/avo2-types';
import { mapDcTermsFormatToSimpleType } from '~shared/helpers/map-format-to-type.ts';

export function isAudioFormat(format: HetArchiefIeObjectType | undefined): boolean {
	const simpleType = mapDcTermsFormatToSimpleType(format);
	return simpleType === HetArchiefSimpleIeObjectType.AUDIO;
}

export function isVideoFormat(format: HetArchiefIeObjectType | undefined): boolean {
	const simpleType = mapDcTermsFormatToSimpleType(format);
	return simpleType === HetArchiefSimpleIeObjectType.VIDEO;
}

export function isAudioVideoFormat(format: HetArchiefIeObjectType | undefined): boolean {
	return isAudioFormat(format) || isVideoFormat(format);
}
