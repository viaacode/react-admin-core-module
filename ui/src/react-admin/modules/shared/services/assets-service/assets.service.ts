import type { Avo } from '@viaa/avo2-types';
import { AdminConfigManager } from '~core/config';
import { CustomError } from '~shared/helpers/custom-error';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';

export class AssetsService {
	public static async uploadFile(
		file: File,
		assetType: Avo.FileUpload.AssetType,
		ownerId: string
	): Promise<string> {
		let url: string | undefined;
		try {
			url = `${AdminConfigManager.getConfig().database.proxyUrl}/admin/assets/upload`;

			const formData = new FormData();
			formData.append('ownerId', ownerId);
			formData.append('filename', file.name);
			formData.append('mimeType', file.type);
			formData.append('type', assetType as any);
			formData.append('content', file, file.name);

			const data = await fetchWithLogoutJson<Avo.FileUpload.AssetInfo>(url, {
				method: 'POST',
				headers: {
					// 'content-type': 'multipart/form-data',
				},
				body: formData,
			});

			return data?.url as string;
		} catch (err) {
			throw new CustomError('Failed to upload file', err, { file, url });
		}
	}

	public static async deleteFile(fileUrl: string): Promise<void> {
		let url: string | undefined;
		let body: any;
		try {
			url = `${AdminConfigManager.getConfig().database.proxyUrl}/admin/assets/delete`;

			body = {
				url: fileUrl,
			};

			const reply = await fetchWithLogoutJson<{ status: 'deleted' } | null>(url, {
				method: 'DELETE',
				body: JSON.stringify(body),
			});

			if (!reply || reply.status !== 'deleted') {
				throw new CustomError(
					'Unexpected response from admin/assets/delete endpoint. Expected {status: deleted}',
					null,
					{ reply, fileUrl }
				);
			}
			return;
		} catch (err) {
			throw new CustomError('Failed to upload file', err, { fileUrl, url, body });
		}
	}
}
