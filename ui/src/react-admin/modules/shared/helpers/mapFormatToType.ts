export enum ObjectType {
	audio = 'audio',
	audiofragment = 'audiofragment',
	film = 'film',
	image = 'image',
	newspaper = 'newspaper',
	newspaperpage = 'newspaperpage',
	video = 'video',
	videofragment = 'videofragment',
}

/**
 * The dcterms formats that can be played by an audio/video player. Mirrors IE_OBJECT_AV_TYPES in
 * hetarchief-proxy, which is what the player-ticket endpoint gates on: anything outside this list
 * is rejected there with "non AV material".
 */
export const IE_OBJECT_AV_FORMATS: readonly ObjectType[] = [
	ObjectType.audio,
	ObjectType.audiofragment,
	ObjectType.film,
	ObjectType.video,
	ObjectType.videofragment,
];

export function mapFormatToType(format?: string): ObjectType | undefined {
	switch ((format || '').toLowerCase()) {
		case 'video':
		case 'film':
			return ObjectType.video;
		case 'audio':
			return ObjectType.audio;
		case 'newspaper':
		case 'krant':
			return ObjectType.newspaper;
		case 'image':
		case 'photo':
			return ObjectType.image;
		default:
			return undefined;
	}
}
