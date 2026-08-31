import type {
	IeObject,
	IeObjectFile,
} from '~shared/services/ie-objects-service/ie-objects.types.ts';

/**
 * The mime types FlowPlayer can play. The audio list is ordered: the mp4 with the speaker still is
 * preferred over the mp3, and the backend guarantees only one of the two exists.
 * https://meemoo.atlassian.net/browse/ARC-3121
 */
const FLOWPLAYER_FORMATS = [
	'video/mp4',
	'video/ogv',
	'video/webm',
	'video/m3u8',
	'application/vnd.apple.mpegurl',
	'audio/mp4',
	'audio/mpeg',
];

/** The peak file that draws an audio object's waveform is the object's only json file. */
const PEAK_FILE_FORMATS = ['application/json'];

/** Every file of every representation of every page, in the object's own order. */
const getFiles = (ieObject: IeObject | undefined): IeObjectFile[] =>
	(ieObject?.pages || []).flatMap((page) =>
		(page.representations || []).flatMap((representation) => representation.files || [])
	);

const findFileByFormat = (ieObject: IeObject | undefined, mimeTypes: string[]) =>
	getFiles(ieObject).find((file) => !!file.mimeType && mimeTypes.includes(file.mimeType));

/** The file to feed the player, or undefined for an object that has nothing playable. */
export const findPlayableFile = (ieObject: IeObject | undefined): IeObjectFile | undefined =>
	findFileByFormat(ieObject, FLOWPLAYER_FORMATS);

export const findPeakFile = (ieObject: IeObject | undefined): IeObjectFile | undefined =>
	findFileByFormat(ieObject, PEAK_FILE_FORMATS);
