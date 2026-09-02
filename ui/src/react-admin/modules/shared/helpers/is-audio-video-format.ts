import {
	type HetArchiefIeObjectType as IeObjectType,
	HetArchiefSimpleIeObjectType as SimpleIeObjectType,
} from '@viaa/avo2-types';
import { mapDcTermsFormatToSimpleType } from '~shared/helpers/map-format-to-type.ts';

export function isAudioFormat(format: IeObjectType | undefined): boolean {
	const simpleType = mapDcTermsFormatToSimpleType(format);
	return simpleType === SimpleIeObjectType.AUDIO;
}

export function isVideoFormat(format: IeObjectType | undefined): boolean {
	const simpleType = mapDcTermsFormatToSimpleType(format);
	return simpleType === SimpleIeObjectType.VIDEO;
}

export function isAudioVideoFormat(format: IeObjectType | undefined): boolean {
	return isAudioFormat(format) || isVideoFormat(format);
}

export function isNewspaperFormat(format: IeObjectType | undefined): boolean {
	return mapDcTermsFormatToSimpleType(format) === SimpleIeObjectType.NEWSPAPER;
}
