import { AdminConfigManager } from '~core/config';
import { fetchWithLogoutJson } from '~modules/shared/helpers/fetch-with-logout';
import { CustomError } from '~modules/shared/helpers/custom-error';

export type BasicOrganisation = {
	or_id: string;
	name: string;
};

export class OrganisationService {
	private static getBaseUrl(): string {
		return `${AdminConfigManager.getConfig().database.proxyUrl}/admin/organisations`;
	}

	public static async fetchOrganisationsWithUsers(): Promise<BasicOrganisation[]> {
		try {
			return fetchWithLogoutJson(this.getBaseUrl() + '/with-users');
		} catch (err) {
			throw new CustomError(
				'Failed to get organisations that have users from the database',
				err
			);
		}
	}
}
