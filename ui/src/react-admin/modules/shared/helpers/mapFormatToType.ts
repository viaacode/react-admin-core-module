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
