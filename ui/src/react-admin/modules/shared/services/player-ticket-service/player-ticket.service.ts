import { stringifyUrl } from 'query-string';
import { CustomError } from '~shared/helpers/custom-error';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getAdminCoreApiUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';

export class PlayerTicketService {
	private static getBaseUrl(): string {
		return `${getAdminCoreApiUrl()}/admin/player-ticket`;
	}

	/**
	 * Requests a playable url (jwt token embedded in the url) for a media item, optionally
	 * scoped to a start and end time (in seconds) so only that fragment can be played.
	 * @param externalId external_id (avo) or SchemaIdentifier (hetarchief) of the media item
	 * @param startTime optional start time of the fragment in seconds
	 * @param endTime optional end time of the fragment in seconds
	 */
	public static async getPlayableUrl(
		externalId: string,
		startTime?: string,
		endTime?: string
	): Promise<string> {
		try {
			return await fetchWithLogoutJson<string>(
				stringifyUrl({
					url: PlayerTicketService.getBaseUrl(),
					query: {
						externalId,
						startTime: startTime || undefined,
						endTime: endTime || undefined,
					},
				})
			);
		} catch (err) {
			throw new CustomError('Failed to get the playable url for the item', err, {
				externalId,
				startTime,
				endTime,
			});
		}
	}
}
