export interface AssetToken {
	token: string;
	owner: string;
	scope: string;
	expiration: string; // Timestamp
	creation: string; // Timestamp
	secret: string;
}

export type UploadFile = UploadFileByBuffer | UploadFileByPath;

export interface UploadFileByBuffer {
	originalname: string;
	buffer: Buffer;
}
export interface UploadFileByPath {
	originalname: string;
	path: string;
}
