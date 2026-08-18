import {
	mapDcTermsFormatToSimpleType,
	type ObjectType,
	SimpleIeObjectType,
} from '~shared/helpers/map-format-to-type.ts';

export function isAudioFormat(format: ObjectType | undefined): boolean {
	const simpleType = mapDcTermsFormatToSimpleType(format);
	return simpleType === SimpleIeObjectType.AUDIO;
}

export function isVideoFormat(format: ObjectType | undefined): boolean {
	const simpleType = mapDcTermsFormatToSimpleType(format);
	return simpleType === SimpleIeObjectType.VIDEO;
}

export function isAudioVideoFormat(format: ObjectType | undefined): boolean {
	return isAudioFormat(format) || isVideoFormat(format);
}
