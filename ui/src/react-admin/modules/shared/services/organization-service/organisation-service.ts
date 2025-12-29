import type { AvoCoreContentPickerType } from '@viaa/avo2-types';
import { stringifyUrl } from 'query-string';
import { CustomError } from '~shared/helpers/custom-error';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import {
	getAdminCoreApiUrl,
	getProxyUrl,
} from '~shared/helpers/get-proxy-url-from-admin-core-config';
import type { MaintainerGridOrganisation } from '~shared/types/organisation.types';

export type BasicOrganisation = {
	or_id: string;
	name: string;
};

export class OrganisationService {
	private static getBaseUrl(): string {
		return `${getAdminCoreApiUrl()}/admin/organisations`;
	}

	public static async fetchOrganisationsWithUsers(): Promise<BasicOrganisation[]> {
		try {
			return fetchWithLogoutJson(`${OrganisationService.getBaseUrl()}/with-users`);
		} catch (err) {
			throw new CustomError('Failed to get organisations that have users from the database', err);
		}
	}

	static getMaintainersByContentItem(
		contentItemType:
			| AvoCoreContentPickerType.ITEM
			| AvoCoreContentPickerType.COLLECTION
			| AvoCoreContentPickerType.ASSIGNMENT,
		contentItemId: string
	): Promise<{ name: string; id: string; logo: string; website: string }[]> {
		return fetchWithLogoutJson(
			stringifyUrl({
				url: `${getProxyUrl()}/organisations/by-content`,
				query: {
					contentItemType,
					contentItemId,
				},
			})
		);
	}

	static getMaintainerGrid(limit: number): Promise<MaintainerGridOrganisation[]> {
		return fetchWithLogoutJson(
			stringifyUrl({
				url: `${getProxyUrl()}/organisations/maintainer-grid`,
				query: {
					limit,
				},
			})
		);
	}
}
