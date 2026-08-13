export interface IeObjectFile {
	id: string;
	name: string;
	mimeType: string;
	storedAt: string;
	thumbnailUrl: string;
	duration: string;
	edmIsNextInSequence: string;
	createdAt: string;
	mediaFragment: {
		startTime: number;
		endTime: number;
	} | null;
}

export enum IeObjectType {
	VIDEO = 'video',
	VIDEO_FRAGMENT = 'videofragment',
	AUDIO = 'audio',
	AUDIO_FRAGMENT = 'audiofragment',
	FILM = 'film',
	NEWSPAPER = 'newspaper',
	NEWSPAPER_PAGE = 'newspaperpage', // Should never be used, but does seem to pop up some times
	IMAGE = 'image', // Should never be used, but does seem to pop up some times
}

export interface IeObjectRepresentation {
	id: string;
	schemaName: string;
	schemaInLanguage: string;
	schemaStartTime: string;
	schemaEndTime: string;
	schemaTranscript: string;
	schemaTranscriptUrl: string | null;
	edmIsNextInSequence: string;
	updatedAt: string;
	isMediaFragmentOf: string;
	files: IeObjectFile[];
}

export interface CuePoints {
	end: number | null;
	start: number | null;
}

export type AudioOrVideoPlayerProps = {
	className?: string;
	allowFullScreen?: boolean;
	paused: boolean;
	onPlay: () => void;
	onPause: () => void;
	onMediaReady: (isAvailable: boolean, playableFile: IeObjectFile | null) => void;
	onMediaDurationLoaded?: (duration: number) => void;
	dctermsFormat: IeObjectType | null;
	schemaIdentifier: string | undefined;
	representation: IeObjectRepresentation | null | undefined;
	maintainerLogo: string | null | undefined;
	cuePoints: CuePoints | undefined;
	locationId: string;
	poster: string | undefined;
};
