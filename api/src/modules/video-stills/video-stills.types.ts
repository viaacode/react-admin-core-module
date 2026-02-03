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
