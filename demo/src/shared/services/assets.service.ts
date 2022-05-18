import { ApiService } from '~modules/shared/services/api-service';
import { ASSETS_SERVICE_BASE_URL } from './assets.consts';

export class AssetsService {
	public static async uploadFile(file: File): Promise<string> {
		const formData = new FormData();
		formData.append('filename', file.name);
		formData.append('mimeType', file.type);
		formData.append('content', file, file.name);

		const response: { url: string } = await ApiService.getApi()
			.post(ASSETS_SERVICE_BASE_URL, {
				body: formData,
			})
			.json();
		return response.url;
	}

	public static async deleteFile(url: string): Promise<void> {
		await ApiService.getApi()
			.delete(ASSETS_SERVICE_BASE_URL, {
				body: JSON.stringify({ url }),
			})
			.json();
	}
}
