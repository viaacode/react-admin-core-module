import { ContentPickerType } from '@viaa/avo2-types';
import { stringifyUrl } from 'query-string';
import { AdminConfigManager } from '~core/config';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { CustomError } from '~shared/helpers/custom-error';

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

	static getMaintainersByContentItem(
		contentItemType:
			| ContentPickerType.ITEM
			| ContentPickerType.COLLECTION
			| ContentPickerType.ASSIGNMENT,
		contentItemId: string
	): Promise<{ name: string; id: string; logo: string; website: string }[]> {
		return fetchWithLogoutJson(
			stringifyUrl({
				url: `http://localhost:3000/organisations/by-content`,
				// url: `${AdminConfigManager.getConfig().database.proxyUrl}/organisations/by-content`,
				query: {
					contentItemType,
					contentItemId,
				},
			})
		);
	}
}
