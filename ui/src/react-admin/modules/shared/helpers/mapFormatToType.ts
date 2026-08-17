export enum IeObjectType {
	audio = 'audio',
	audiofragment = 'audiofragment',
	film = 'film',
	image = 'image', // Should never be used, but does seem to pop up some times
	newspaper = 'newspaper',
	newspaperpage = 'newspaperpage', // Should never be used, but does seem to pop up some times
	video = 'video',
	videofragment = 'videofragment',
}

export function mapFormatToType(format?: string): IeObjectType | undefined {
	switch ((format || '').toLowerCase()) {
		case 'video':
		case 'film':
			return IeObjectType.video;
		case 'audio':
			return IeObjectType.audio;
		case 'newspaper':
		case 'krant':
			return IeObjectType.newspaper;
		case 'image':
		case 'photo':
			return IeObjectType.image;
		default:
			return undefined;
	}
}
