import {
	type IeObjectType,
	mapDcTermsFormatToSimpleType,
	SimpleIeObjectType,
} from '~shared/helpers/map-format-to-type.ts';

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
