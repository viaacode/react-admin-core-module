import { Avo } from '@viaa/avo2-types';
import { ClientEducationOrganization } from '@viaa/avo2-types/types/education-organizations';
import { compact, flatten, get } from 'lodash-es';
import { AdminConfigManager } from '~core/config';

import {
	BulkAddSubjectsToProfilesDocument,
	BulkAddSubjectsToProfilesMutation,
	BulkAddSubjectsToProfilesMutationVariables,
	BulkClearUserTempAccessDocument,
	BulkClearUserTempAccessMutation,
	BulkClearUserTempAccessMutationVariables,
	BulkDeleteSubjectsFromProfilesDocument,
	BulkDeleteSubjectsFromProfilesMutation,
	BulkDeleteSubjectsFromProfilesMutationVariables,
	GetContentCountsForUsersDocument,
	GetContentCountsForUsersQuery,
	GetContentCountsForUsersQueryVariables,
	GetDistinctBusinessCategoriesDocument,
	GetDistinctBusinessCategoriesQuery,
	GetDistinctBusinessCategoriesQueryVariables,
	GetProfileNamesQuery as GetProfileNamesQueryAvo,
	GetUsersQuery as GetUsersQueryAvo,
} from '~generated/graphql-db-types-avo';
import {
	GetProfileNamesQuery as GetProfileNamesQueryHetArchief,
	GetUsersQuery as GetUsersQueryHetArchief,
} from '~generated/graphql-db-types-hetarchief';
import { fetchWithLogout } from '~modules/shared/helpers/fetch-with-logout';
import { getOrderObject } from '~modules/shared/helpers/generate-order-gql-query';
import { AvoOrHetArchief } from '~modules/shared/types';
import { USER_QUERIES, UserQueryTypes } from '~modules/user/queries/users.queries';

import { CustomError } from '../shared/helpers/custom-error';
import { dataService } from '../shared/services/data-service';

import { GET_TABLE_COLUMN_TO_DATABASE_ORDER_OBJECT, ITEMS_PER_PAGE } from './user.consts';
import {
	CommonUser,
	DeleteContentCounts,
	Idp,
	ProfileAvo,
	ProfileHetArchief,
	UserOverviewTableCol,
} from './user.types';

export class UserService {
	private static getQueries() {
		return USER_QUERIES[AdminConfigManager.getConfig().database.databaseApplicationType];
	}

	public static adaptProfile(
		userProfile: ProfileAvo | ProfileHetArchief | undefined
	): CommonUser | undefined {
		if (!userProfile) {
			return undefined;
		}

		const database = AdminConfigManager.getConfig().database.databaseApplicationType;
		const shared = {
			email: userProfile.mail || undefined,
			firstName: userProfile.first_name || undefined,
			lastName: userProfile.last_name || undefined,
			fullName: userProfile.full_name || (userProfile as any).user?.full_name || undefined,
			last_access_at: userProfile.last_access_at,
		};

		if (database === AvoOrHetArchief.hetArchief) {
			const user = userProfile as ProfileHetArchief;

			return {
				...shared,
				profileId: user.id,
				userGroup: {
					id: user.group?.id,
					name: user.group?.name,
					label: user.group?.label,
				},
				idps: user.identities?.map((identity) => identity.identity_provider_name as Idp),
				organisation: {
					name: user.maintainer_users_profiles?.[0]?.maintainer.schema_name || undefined,
					or_id: user.maintainer_users_profiles?.[0]?.maintainer.schema_identifier,
					logo_url:
						user.maintainer_users_profiles?.[0]?.maintainer?.information?.logo?.iri,
				},
			};
		} else if (database === AvoOrHetArchief.avo) {
			const user = userProfile as ProfileAvo;

			return {
				...shared,
				profileId: user.profile_id,
				stamboek: user.stamboek || undefined,
				organisation:
					(user.company_name && {
						name: user.company_name,
					}) ||
					(userProfile as any).organisation,
				educational_organisations: (user.organisations || []).map(
					(org): ClientEducationOrganization => ({
						organizationId: org.organization_id,
						unitId: org.unit_id || null,
						label: org.organization?.ldap_description || '',
					})
				),
				subjects: user.classifications?.map((classification) => classification.key),
				education_levels: user.contexts?.map((context) => context.key),
				is_exception: user.is_exception || undefined,
				business_category: user.business_category || undefined,
				created_at: user.acc_created_at,
				userGroup: {
					name:
						user.group_name ||
						(userProfile as any).profile_user_group?.group?.label ||
						undefined,
					label:
						user.group_name ||
						(userProfile as any).profile_user_group?.group?.label ||
						undefined,
					id:
						user.group_id ||
						(userProfile as any).profile_user_group?.group?.id ||
						undefined,
				},
				userId: user.user_id || (userProfile as any).user?.id,
				uid: user.user_id || (userProfile as any).user?.id,
				is_blocked: user.is_blocked || undefined,
				blocked_at: get(user, 'blocked_at.date'),
				unblocked_at: get(user, 'unblocked_at.date'),
				temp_access: user.user?.temp_access || undefined,
				idps: user.idps?.map((idp) => idp.idp as unknown as Idp),
			};
		}
	}

	static async getProfiles(
		page: number,
		sortColumn: UserOverviewTableCol,
		sortOrder: Avo.Search.OrderDirection,
		tableColumnDataType: string,
		where: any = {},
		itemsPerPage: number = ITEMS_PER_PAGE
	): Promise<[CommonUser[], number]> {
		let variables: any;
		try {
			// Hetarchief doesn't have a is_deleted column yet
			const whereWithoutDeleted =
				AdminConfigManager.getConfig().database.databaseApplicationType ===
				AvoOrHetArchief.hetArchief
					? where
					: {
							...where,
							is_deleted: { _eq: false },
					  };

			variables = {
				offset: itemsPerPage * page,
				limit: itemsPerPage,
				where: whereWithoutDeleted,
				orderBy: getOrderObject(
					sortColumn,
					sortOrder,
					tableColumnDataType,
					GET_TABLE_COLUMN_TO_DATABASE_ORDER_OBJECT()
				),
			};

			const response = await dataService.query<GetUsersQueryAvo & GetUsersQueryHetArchief>({
				variables,
				query: this.getQueries().GetUsersDocument,
			});

			// Convert user format to profile format since we initially wrote the ui to deal with profiles
			const userProfileObjects =
				response?.users_profile || response?.users_summary_view || [];
			const profiles: CommonUser[] = compact(userProfileObjects.map(this.adaptProfile));

			const profileCount =
				response?.users_summary_view_aggregate?.aggregate?.count ||
				response?.users_profile_aggregate?.aggregate?.count ||
				0;

			if (!profiles) {
				throw new CustomError('Response does not contain any profiles', null, {
					response,
				});
			}

			return [profiles as any[], profileCount];
		} catch (err) {
			throw new CustomError('Failed to get profiles from the database', err, {
				variables,
				query: 'GET_USERS',
			});
		}
	}

	static async getNamesByProfileIds(profileIds: string[]): Promise<Partial<CommonUser>[]> {
		try {
			const response = await dataService.query<
				UserQueryTypes['GetProfileNamesQuery'],
				UserQueryTypes['GetProfileNamesQueryVariables']
			>({
				query: this.getQueries().GetProfileNamesDocument,
				variables: {
					profileIds,
				},
			});

			/* istanbul ignore next */
			if (
				AdminConfigManager.getConfig().database.databaseApplicationType ===
				AvoOrHetArchief.hetArchief
			) {
				return (
					(response as UserQueryTypes['GetProfileNamesQueryHetArchief'])?.users_profile ||
					[]
				).map(
					(
						profileEntry: GetProfileNamesQueryHetArchief['users_profile'][0]
					): Partial<CommonUser> => ({
						profileId: profileEntry.id,
						fullName: profileEntry.full_name || undefined,
						email: profileEntry.mail || undefined,
					})
				);
			} else {
				return (
					(response as UserQueryTypes['GetProfileNamesQueryAvo'])?.users_summary_view ||
					[]
				).map(
					(
						profileEntry: GetProfileNamesQueryAvo['users_summary_view'][0]
					): Partial<CommonUser> => ({
						profileId: profileEntry.profile_id,
						fullName: profileEntry.full_name || undefined,
						email: profileEntry.mail || undefined,
					})
				);
			}
		} catch (err) {
			throw new CustomError('Failed to get profile names from the database', err, {
				profileIds,
				query: 'GET_PROFILE_NAMES',
			});
		}
	}

	static async getProfileIds(
		where?: UserQueryTypes['GetProfileIdsQueryVariables']['where']
	): Promise<string[]> {
		let variables: UserQueryTypes['GetProfileIdsQueryVariables'] | null = null;
		try {
			variables = {
				where: where || {},
			};
			const response = await dataService.query<
				UserQueryTypes['GetProfileIdsQuery'],
				UserQueryTypes['GetProfileIdsQueryVariables']
			>({
				variables,
				query: this.getQueries().GetProfileIdsDocument,
			});

			if (
				AdminConfigManager.getConfig().database.databaseApplicationType ===
				AvoOrHetArchief.avo
			) {
				// avo
				return compact(
					(
						(response as UserQueryTypes['GetProfileIdsQueryAvo']).users_summary_view ||
						[]
					).map((user) => user?.profile_id)
				);
			}
			// archief
			return compact(
				(
					(response as UserQueryTypes['GetProfileIdsQueryHetArchief']).users_profile || []
				).map((user) => user?.id)
			);
		} catch (err) {
			throw new CustomError('Failed to get profile ids from the database', err, {
				variables,
				query: 'GET_PROFILE_IDS',
			});
		}
	}

	static async updateBlockStatusByProfileIds(
		profileIds: string[],
		isBlocked: boolean,
		sendEmail: boolean
	): Promise<void> {
		if (
			AdminConfigManager.getConfig().database.databaseApplicationType ===
			AvoOrHetArchief.hetArchief
		) {
			return;
		}

		let url: string | undefined;
		try {
			url = `${AdminConfigManager.getConfig().database.proxyUrl}/admin/user/bulk-block`;
			const body: Avo.User.BulkBlockUsersBody = {
				profileIds,
				isBlocked,
				sendEmail,
			};

			const response = await fetchWithLogout(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(body),
			});

			if (isBlocked) {
				await dataService.query<BulkClearUserTempAccessMutation, BulkClearUserTempAccessMutationVariables>({
					variables: { profileIds },
					query: BulkClearUserTempAccessDocument,
				})
			}

			if (response.status < 200 || response.status >= 400) {
				throw new CustomError('Status code was unexpected', null, {
					response,
				});
			}
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
			const response = await dataService.query<
				GetDistinctBusinessCategoriesQuery,
				GetDistinctBusinessCategoriesQueryVariables
			>({
				query: GetDistinctBusinessCategoriesDocument,
			});

			return compact(
				(response.users_profiles || []).map((profile) => profile.business_category)
			);
		} catch (err) {
			throw new CustomError('Failed to get distinct business categories from profiles', err, {
				query: 'GET_DISTINCT_BUSINESS_CATEGORIES',
			});
		}
	}

	static async fetchIdps() {
		try {
			const response = await dataService.query<
				UserQueryTypes['GetIdpsQuery'],
				UserQueryTypes['GetIdpsQueryVariables']
			>({
				query: this.getQueries().GetIdpsDocument,
			});

			/* istanbul ignore next */
			if (
				AdminConfigManager.getConfig().database.databaseApplicationType ===
				AvoOrHetArchief.hetArchief
			) {
				return (
					(response as UserQueryTypes['GetIdpsQueryHetArchief'])
						.users_identity_provider || []
				).map((idp) => idp.name);
			}

			return ((response as UserQueryTypes['GetIdpsQueryAvo']).users_idps || []).map(
				(idp) => idp.value
			);
		} catch (err) {
			throw new CustomError('Failed to get idps from the database', err, {
				query: 'GET_IDPS',
			});
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
			url = `${AdminConfigManager.getConfig().database.proxyUrl}/admin/user/bulk-delete`;
			const body: Avo.User.BulkDeleteUsersBody = {
				profileIds,
				deleteOption,
				sendEmail,
				...(isAvo ? { transferToProfileId } : {}),
			};
			const response = await fetchWithLogout(url, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(body),
			});

			if (response.status < 200 || response.status >= 400) {
				throw new CustomError('Status code was unexpected', null, {
					response,
				});
			}
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
			const response = await dataService.query<
				GetContentCountsForUsersQuery,
				GetContentCountsForUsersQueryVariables
			>({
				query: GetContentCountsForUsersDocument,
				variables: {
					profileIds,
				},
			});

			return {
				publicCollections: response.publicCollections?.aggregate?.count || 0,
				privateCollections: response.privateCollections?.aggregate?.count || 0,
				assignments: response.assignments?.aggregate?.count || 0,
				bookmarks:
					(response.collectionBookmarks?.aggregate?.count || 0) +
					(response.itemBookmarks?.aggregate?.count || 0),
				publicContentPages: response.publicContentPages?.aggregate?.count || 0,
				privateContentPages: response.privateContentPages?.aggregate?.count || 0,
			};
		} catch (err) {
			throw new CustomError('Failed to get content counts for users from the database', err, {
				profileIds,
				query: 'GET_CONTENT_COUNTS_FOR_USERS',
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
			// First remove the subjects, so we can add them without duplicate conflicts
			await UserService.bulkRemoveSubjectsFromProfiles(subjects, profileIds);

			// Add the subjects
			await dataService.query<
				BulkAddSubjectsToProfilesMutation,
				BulkAddSubjectsToProfilesMutationVariables
			>({
				query: BulkAddSubjectsToProfilesDocument,
				variables: {
					subjects: flatten(
						subjects.map((subject) =>
							profileIds.map((profileId) => ({
								key: subject,
								profile_id: profileId,
							}))
						)
					),
				},
			});
			await AdminConfigManager.getConfig().services.queryCache.clear('clearUserCache');
		} catch (err) {
			throw new CustomError('Failed to bulk add subjects to profiles', err, {
				subjects,
				profileIds,
				query: 'BULK_ADD_SUBJECTS_TO_PROFILES',
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
			await dataService.query<
				BulkDeleteSubjectsFromProfilesMutation,
				BulkDeleteSubjectsFromProfilesMutationVariables
			>({
				query: BulkDeleteSubjectsFromProfilesDocument,
				variables: {
					subjects,
					profileIds,
				},
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
