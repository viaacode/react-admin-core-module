import { ObjectType } from '~shared/helpers/map-format-to-type.ts';

export function isAudioFormat(format: ObjectType | undefined): boolean {
	return format === ObjectType.audio || format === ObjectType.audiofragment;
}

export function isVideoFormat(format: ObjectType | undefined): boolean {
	return (
		format === ObjectType.film || format === ObjectType.video || format === ObjectType.videofragment
	);
}

export function isAudioVideoFormat(format: ObjectType | undefined): boolean {
	return isAudioFormat(format) || isVideoFormat(format);
}
