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

export interface VideoStillToken {
	refresh_token: string;
	token_type: string;
	access_token: string;
	expires_in: number;
	expires_at: Date;
}

export interface ObjectNameInfo {
	externalId: string;
	type: 'audio' | 'video' | 'other';
	objectName: string;
	startTime: number;
}

export interface ObjectNameInfoAndStills {
	externalId: string;
	type: 'audio' | 'video' | 'other';
	objectName: string;
	startTime: number;
	videoStills: VideoStill[];
}
