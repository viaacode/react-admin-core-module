export class AssetsService {
	public static async uploadFile(file: File): Promise<string> {
		console.info('uploading file: ', file);
		return 'fake-url-for-admin-core-demo-purposes';
	}

	public static async deleteFile(url: string): Promise<void> {
		console.info('deleting file: ', url);
	}
}
