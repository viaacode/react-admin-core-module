import type { Avo } from '@viaa/avo2-types';
import { stringifyUrl } from 'query-string';
import { AdminConfigManager } from '~core/config';

import { fetchWithLogout, fetchWithLogoutJson } from '~modules/shared/helpers/fetch-with-logout';
import { AvoOrHetArchief } from '~modules/shared/types';

import { CustomError } from '../shared/helpers/custom-error';

import {
	CommonUser,
	DeleteContentCounts,
	UserOverviewTableCol,
	USERS_PER_PAGE,
} from './user.types';

export class UserService {
	private static getBaseUrl(): string {
		return `${AdminConfigManager.getConfig().database.proxyUrl}/admin/users`;
	}

	static async getProfiles(
		page: number,
		sortColumn: UserOverviewTableCol,
		sortOrder: Avo.Search.OrderDirection,
		tableColumnDataType: string,
		where: any = {},
		itemsPerPage: number = USERS_PER_PAGE
	): Promise<[CommonUser[], number]> {
		try {
			return fetchWithLogoutJson(
				stringifyUrl({
					url: this.getBaseUrl(),
					query: {
						offset: page * USERS_PER_PAGE,
						limit: itemsPerPage,
						sortColumn,
						sortOrder,
						tableColumnDataType,
						where: JSON.stringify(where),
					},
				})
			);
		} catch (err) {
			throw new CustomError('Failed to get profiles from the server', err, {
				page,
				sortColumn,
				sortOrder,
				tableColumnDataType,
				where,
				itemsPerPage,
			});
		}
	}

	static async getNamesByProfileIds(profileIds: string[]): Promise<Partial<CommonUser>[]> {
		try {
			return fetchWithLogoutJson(
				stringifyUrl({
					url: this.getBaseUrl() + 'names',
					query: {
						profileIds,
					},
				})
			);
		} catch (err) {
			throw new CustomError('Failed to get profile names from the server', err, {
				profileIds,
			});
		}
	}

	static async getProfileIds(where?: any): Promise<string[]> {
		try {
			return fetchWithLogoutJson(
				stringifyUrl({
					url: this.getBaseUrl() + 'ids',
					query: {
						where: JSON.stringify(where),
					},
				})
			);
		} catch (err) {
			throw new CustomError('Failed to get profile ids from the server', err, {
				where,
			});
		}
	}

	static async updateBlockStatusByProfileIds(
		profileIds: string[],
		isBlocked: boolean,
		sendEmail?: boolean
	): Promise<void> {
		if (
			AdminConfigManager.getConfig().database.databaseApplicationType ===
			AvoOrHetArchief.hetArchief
		) {
			return;
		}

		let url: string | undefined;
		try {
			url = `${this.getBaseUrl()}/user/bulk-block`;
			const body: Avo.User.BulkBlockUsersBody = {
				profileIds,
				isBlocked,
				sendEmail: !!sendEmail,
			};

			await fetchWithLogout(url, {
				method: 'POST',
				body: JSON.stringify(body),
			});
		} catch (err) {
			throw new CustomError(
				'Failed to update is_blocked field for users in the database',
				err,
				{
					url,
					profileIds,
					isBlocked,
				}
			);
		}
	}

	static async fetchDistinctBusinessCategories(): Promise<string[]> {
		if (
			AdminConfigManager.getConfig().database.databaseApplicationType ===
			AvoOrHetArchief.hetArchief
		) {
			return [];
		}

		try {
			return fetchWithLogoutJson(this.getBaseUrl() + '/business-categories');
		} catch (err) {
			throw new CustomError(
				'Failed to get distinct business categories from the server',
				err
			);
		}
	}

	static async fetchIdps() {
		try {
			return fetchWithLogoutJson(this.getBaseUrl() + '/idps');
		} catch (err) {
			throw new CustomError('Failed to get idps from the database', err);
		}
	}

	static async bulkDeleteUsers(
		profileIds: string[],
		deleteOption: Avo.User.UserDeleteOption,
		sendEmail: boolean,
		transferToProfileId?: string
	): Promise<void> {
		let url: string | undefined;
		const isAvo =
			AdminConfigManager.getConfig().database.databaseApplicationType === AvoOrHetArchief.avo;

		try {
			url = `${this.getBaseUrl()}/user/bulk-delete`;
			const body: Avo.User.BulkDeleteUsersBody = {
				profileIds,
				deleteOption,
				sendEmail,
				...(isAvo ? { transferToProfileId } : {}),
			};
			await fetchWithLogout(url, {
				method: 'DELETE',
				body: JSON.stringify(body),
			});
		} catch (err) {
			throw new CustomError('Failed to bulk delete users from the database', err, {
				url,
				profileIds,
				deleteOption,
				transferToProfileId,
			});
		}
	}

	static async fetchPublicAndPrivateCounts(profileIds: string[]): Promise<DeleteContentCounts> {
		if (
			AdminConfigManager.getConfig().database.databaseApplicationType ===
			AvoOrHetArchief.hetArchief
		) {
			console.info("fetching counts isn't supported for hetarchief");
			return {
				publicCollections: 0,
				privateCollections: 0,
				assignments: 0,
				bookmarks: 0,
				publicContentPages: 0,
				privateContentPages: 0,
			};
		}

		try {
			return fetchWithLogoutJson(
				stringifyUrl({
					url: this.getBaseUrl() + '/counts',
					query: {
						profileIds,
					},
				})
			);
		} catch (err) {
			throw new CustomError('Failed to get content counts for users from the server', err, {
				profileIds,
			});
		}
	}

	static async bulkAddSubjectsToProfiles(
		subjects: string[],
		profileIds: string[]
	): Promise<void> {
		if (
			AdminConfigManager.getConfig().database.databaseApplicationType ===
			AvoOrHetArchief.hetArchief
		) {
			console.info("adding subjects to profiles isn't supported for hetarchief");
			return;
		}

		try {
			await fetchWithLogoutJson(this.getBaseUrl() + '/subjects', {
				method: 'PATCH',
				body: JSON.stringify({
					subjects,
					profileIds,
				}),
			});
			await AdminConfigManager.getConfig().services.queryCache.clear('clearUserCache');
		} catch (err) {
			throw new CustomError('Failed to bulk add subjects to profiles', err, {
				subjects,
				profileIds,
			});
		}
	}

	static async bulkRemoveSubjectsFromProfiles(
		subjects: string[],
		profileIds: string[]
	): Promise<void> {
		if (
			AdminConfigManager.getConfig().database.databaseApplicationType ===
			AvoOrHetArchief.hetArchief
		) {
			console.info("removing subjects from profiles isn't supported for hetarchief");
			return;
		}

		try {
			await fetchWithLogoutJson(this.getBaseUrl() + '/subjects', {
				method: 'DELETE',
				body: JSON.stringify({
					subjects,
					profileIds,
				}),
			});
			await AdminConfigManager.getConfig().services.queryCache.clear('clearUserCache');
		} catch (err) {
			throw new CustomError('Failed to bulk delete subjects from profiles', err, {
				subjects,
				profileIds,
				query: 'BULK_DELETE_SUBJECTS_FROM_PROFILES',
			});
		}
	}
}
