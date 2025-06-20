import type { Avo } from "@viaa/avo2-types";
import { stringifyUrl } from "query-string";
import { AdminConfigManager } from "~core/config";
import { CustomError } from "~shared/helpers/custom-error";
import {
	fetchWithLogout,
	fetchWithLogoutJson,
} from "~shared/helpers/fetch-with-logout";
import {
	getAdminCoreApiUrl,
	getProxyUrl,
} from "~shared/helpers/get-proxy-url-from-admin-core-config";
import { isAvo } from "~shared/helpers/is-avo";
import { isHetArchief } from "~shared/helpers/is-hetarchief";

import type {
	DeleteContentCounts,
	Idp,
	UserOverviewTableCol,
} from "./user.types";

export class UserService {
	private static getBaseUrl(): string {
		return `${getAdminCoreApiUrl()}/admin/users`;
	}

	static async getUserById(id: string): Promise<Avo.User.CommonUser> {
		try {
			return fetchWithLogoutJson<Avo.User.CommonUser>(
				stringifyUrl({
					url: `${UserService.getBaseUrl()}/${id}`,
				}),
				{ throwOnNullResponse: true },
			);
		} catch (err) {
			throw new CustomError(
				"Failed to get profile by id from the database",
				err,
				{
					id,
					query: "GET_USER_BY_ID",
				},
			);
		}
	}

	static async getProfiles(
		offset: number,
		limit: number,
		sortColumn: UserOverviewTableCol,
		sortOrder: Avo.Search.OrderDirection,
		tableColumnDataType: string,
		// biome-ignore lint/suspicious/noExplicitAny: todo
		where: any = {},
	): Promise<[Avo.User.CommonUser[], number]> {
		try {
			return fetchWithLogoutJson(UserService.getBaseUrl(), {
				method: "POST",
				body: JSON.stringify({
					offset,
					limit,
					sortColumn,
					sortOrder,
					tableColumnDataType,
					where: JSON.stringify(where),
				}),
			});
		} catch (err) {
			throw new CustomError("Failed to get profiles from the server", err, {
				offset,
				limit,
				sortColumn,
				sortOrder,
				tableColumnDataType,
				where,
			});
		}
	}

	static async getNamesByProfileIds(
		profileIds: string[],
	): Promise<Partial<Avo.User.CommonUser>[]> {
		try {
			return fetchWithLogoutJson(
				stringifyUrl({
					url: `${UserService.getBaseUrl()}/names`,
					query: {
						profileIds,
					},
				}),
			);
		} catch (err) {
			throw new CustomError(
				"Failed to get profile names from the server",
				err,
				{
					profileIds,
				},
			);
		}
	}

	// biome-ignore lint/suspicious/noExplicitAny: todo
	static async getProfileIds(where?: any): Promise<string[]> {
		try {
			return fetchWithLogoutJson(
				stringifyUrl({
					url: `${UserService.getBaseUrl()}/ids`,
					query: {
						where: JSON.stringify(where),
					},
				}),
			);
		} catch (err) {
			throw new CustomError("Failed to get profile ids from the server", err, {
				where,
			});
		}
	}

	static async updateBlockStatusByProfileIds(
		profileIds: string[],
		isBlocked: boolean,
		sendEmail?: boolean,
	): Promise<void> {
		if (isHetArchief()) {
			return;
		}

		let url: string | undefined;
		try {
			url = `${getProxyUrl()}/user/bulk-block`;
			const body: Avo.User.BulkBlockUsersBody = {
				profileIds,
				isBlocked,
				sendEmail: !!sendEmail,
			};

			await fetchWithLogout(url, {
				method: "POST",
				body: JSON.stringify(body),
			});
		} catch (err) {
			throw new CustomError(
				"Failed to update is_blocked field for users in the database",
				err,
				{
					url,
					profileIds,
					isBlocked,
				},
			);
		}
	}

	static async fetchDistinctBusinessCategories(): Promise<string[]> {
		if (isHetArchief()) {
			return [];
		}

		try {
			return fetchWithLogoutJson(
				`${UserService.getBaseUrl()}/business-categories`,
			);
		} catch (err) {
			throw new CustomError(
				"Failed to get distinct business categories from the server",
				err,
			);
		}
	}

	static async fetchIdps(): Promise<Idp[]> {
		try {
			return fetchWithLogoutJson<Idp[]>(`${UserService.getBaseUrl()}/idps`, {
				throwOnNullResponse: true,
			});
		} catch (err) {
			throw new CustomError("Failed to get idps from the database", err);
		}
	}

	static async bulkDeleteUsers(
		profileIds: string[],
		deleteOption: Avo.User.UserDeleteOption,
		sendEmail: boolean,
		transferToProfileId?: string,
	): Promise<void> {
		let url: string | undefined;

		try {
			url = `${getProxyUrl()}/user/bulk-delete`;
			const body: Avo.User.BulkDeleteUsersBody = {
				profileIds,
				deleteOption,
				sendEmail,
				...(isAvo() ? { transferToProfileId } : {}),
			};
			await fetchWithLogout(url, {
				method: "DELETE",
				body: JSON.stringify(body),
			});
		} catch (err) {
			throw new CustomError(
				"Failed to bulk delete users from the database",
				err,
				{
					url,
					profileIds,
					deleteOption,
					transferToProfileId,
				},
			);
		}
	}

	static async fetchPublicAndPrivateCounts(
		profileIds: string[],
	): Promise<DeleteContentCounts> {
		if (isHetArchief()) {
			console.info("fetching counts isn't supported for hetarchief");
			return {
				publicCollections: 0,
				privateCollections: 0,
				publicBundles: 0,
				privateBundles: 0,
				publicAssignments: 0,
				publicAssignmentPupilCollections: 0,
				privateAssignments: 0,
				privateAssignmentPupilCollections: 0,
				publicContentPages: 0,
				privateContentPages: 0,
				bookmarks: 0,
				quickLanes: 0,
			};
		}

		try {
			return fetchWithLogoutJson<DeleteContentCounts>(
				stringifyUrl({
					url: `${UserService.getBaseUrl()}/counts`,
					query: {
						profileIds,
					},
				}),
			);
		} catch (err) {
			throw new CustomError(
				"Failed to get content counts for users from the server",
				err,
				{
					profileIds,
				},
			);
		}
	}

	static async bulkAddSubjectsToProfiles(
		subjects: string[],
		profileIds: string[],
	): Promise<void> {
		if (isHetArchief()) {
			console.info(
				"adding subjects to profiles isn't supported for hetarchief",
			);
			return;
		}

		try {
			await fetchWithLogoutJson(`${UserService.getBaseUrl()}/subjects`, {
				method: "PATCH",
				body: JSON.stringify({
					subjects,
					profileIds,
				}),
			});
			await AdminConfigManager.getConfig().services.queryCache.clear(
				"clearUserCache",
			);
		} catch (err) {
			throw new CustomError("Failed to bulk add subjects to profiles", err, {
				subjects,
				profileIds,
			});
		}
	}

	static async bulkRemoveSubjectsFromProfiles(
		subjects: string[],
		profileIds: string[],
	): Promise<void> {
		if (isHetArchief()) {
			console.info(
				"removing subjects from profiles isn't supported for hetarchief",
			);
			return;
		}

		try {
			await fetchWithLogoutJson(`${UserService.getBaseUrl()}/subjects`, {
				method: "DELETE",
				body: JSON.stringify({
					subjects,
					profileIds,
				}),
			});
			await AdminConfigManager.getConfig().services.queryCache.clear(
				"clearUserCache",
			);
		} catch (err) {
			throw new CustomError(
				"Failed to bulk delete subjects from profiles",
				err,
				{
					subjects,
					profileIds,
					query: "BULK_DELETE_SUBJECTS_FROM_PROFILES",
				},
			);
		}
	}
}
