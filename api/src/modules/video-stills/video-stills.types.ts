export interface VideoStill {
	time: number;
	previewImagePath: string;
	thumbnailImagePath: string;
}

export interface VideoStillRaw {
	AbsoluteTimeCode: string;
	RelativeTimeCode: string;
	ThumbnailImagePath: string;
	PreviewImagePath: string;
}

export enum StillsObjectType {
	audio = 'audio',
	video = 'video',
	other = 'other',
}

export interface ObjectNameInfo {
	id: string | undefined;
	type: StillsObjectType;
	objectName: string;
	startTime: number;
}

export interface ObjectNameInfoAndStills {
	id: string | undefined;
	type: StillsObjectType;
	objectName: string;
	startTime: number;
	videoStills: VideoStill[];
}

/**
 * A single stills lookup that blew up. Kept separate from a plain null (which means "there was
 * nothing to look up for this request") so a failed lookup can be reported instead of silently
 * turning into a missing still.
 */
export interface FailedObjectNameInfo {
	id: string | undefined;
	type: StillsObjectType;
	objectName: string;
	startTime: number;
	// biome-ignore lint/suspicious/noExplicitAny: the underlying error can be any type
	error: any;
}
