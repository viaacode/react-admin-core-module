import type {
	HetArchiefIeObject as IeObject,
	HetArchiefIeObjectFile as IeObjectFile,
} from '@viaa/avo2-types';

/**
 * The proxy only returns the preferred audio rendition: m4a => mp3 => mp4 with speaker image. ARC-4178
 */
const FLOWPLAYER_FORMATS = [
	'video/mp4',
	'video/ogv',
	'video/webm',
	'video/m3u8',
	'application/vnd.apple.mpegurl',
	'audio/m4a',
	'audio/x-m4a',
	'audio/mpeg',
	'audio/mp4',
];

/** The peak file that draws an audio object's waveform is the object's only json file. */
const PEAK_FILE_FORMATS = ['application/json'];

const getFiles = (ieObject: IeObject | undefined): IeObjectFile[] =>
	(ieObject?.pages || []).flatMap((page) =>
		(page.representations || []).flatMap((representation) => representation.files || [])
	);

const findFileByFormat = (ieObject: IeObject | undefined, mimeTypes: string[]) =>
	getFiles(ieObject).find((file) => !!file.mimeType && mimeTypes.includes(file.mimeType));

export const findPlayableFile = (ieObject: IeObject | undefined): IeObjectFile | undefined =>
	findFileByFormat(ieObject, FLOWPLAYER_FORMATS);

export const findPeakFile = (ieObject: IeObject | undefined): IeObjectFile | undefined =>
	findFileByFormat(ieObject, PEAK_FILE_FORMATS);

/**
 * audio/m4a is not a registered mime type, so browsers might refuse to play it.
 * The m4a container is an mp4 container, so we pass audio/mp4 to the player instead. ARC-4178
 */
export const getPlayerMimeType = (mimeType: string | undefined | null): string | undefined => {
	if (mimeType === 'audio/m4a' || mimeType === 'audio/x-m4a') {
		return 'audio/mp4';
	}
	return mimeType || undefined;
};
