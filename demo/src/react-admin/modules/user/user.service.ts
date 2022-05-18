import { Avo } from '@viaa/avo2-types';
import { ClientEducationOrganization } from '@viaa/avo2-types/types/education-organizations';
import { compact, flatten, get } from 'lodash-es';
import { Config } from '~core/config';

import {
	BulkAddSubjectsToProfilesDocument,
	BulkDeleteSubjectsFromProfilesDocument,
	GetContentCountsForUsersDocument,
	GetDistinctBusinessCategoriesDocument,
	GetProfileNamesQuery as GetProfileNamesQueryAvo,
	GetUsersQuery as GetUsersQueryAvo,
} from '~generated/graphql-db-types-avo';
import {
	GetProfileIdsQuery,
	GetProfileNamesQuery as GetProfileNamesQueryHetArchief,
	GetUsersQuery as GetUsersQueryHetArchief,
} from '~generated/graphql-db-types-hetarchief';
import { fetchWithLogout } from '~modules/shared/helpers/fetch-with-logout';
import { getOrderObject } from '~modules/shared/helpers/generate-order-gql-query';
import { AvoOrHetArchief } from '~modules/shared/types';
import { USER_QUERIES } from '~modules/user/queries/users.queries';

import { CustomError } from '../shared/helpers/custom-error';
import { dataService } from '../shared/services/data-service';

import { GET_TABLE_COLUMN_TO_DATABASE_ORDER_OBJECT, ITEMS_PER_PAGE } from './user.consts';
import { CommonUser, DeleteContentCounts, Idp, UserOverviewTableCol } from './user.types';

export class UserService {
	private static getQueries() {
		return USER_QUERIES[Config.getConfig().database.databaseApplicationType];
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
		console.log('input where', where);
		try {
			// Hetarchief doesn't have a is_deleted column yet
			const whereWithoutDeleted =
				Config.getConfig().database.databaseApplicationType === AvoOrHetArchief.hetArchief
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

			if (response.errors) {
				throw new CustomError('Response from graphql contains errors', null, {
					response,
				});
			}

			// Convert user format to profile format since we initially wrote the ui to deal with profiles
			let profiles: CommonUser[];

			/* istanbul ignore next */
			if (
				Config.getConfig().database.databaseApplicationType === AvoOrHetArchief.hetArchief
			) {
				profiles = (response?.data as GetUsersQueryHetArchief).users_profile.map(
					(user): CommonUser => {
						return {
							profileId: user.id,
							email: user.mail || undefined,
							firstName: user.first_name || undefined,
							lastName: user.last_name || undefined,
							fullName: user.full_name || undefined,
							userGroup: user.group?.label || undefined,
							last_access_at: user.last_access_at,
							idps: user.identities.map(
								(identity) => identity.identity_provider_name as Idp
							),
							organisation: {
								name:
									user.maintainer_users_profiles?.[0]?.maintainer.schema_name ||
									undefined,
								or_id: user.maintainer_users_profiles?.[0]?.maintainer
									.schema_identifier,
								logo_url:
									user.maintainer_users_profiles?.[0]?.maintainer.information?.[0]
										?.logo?.iri,
							},
						};
					}
				);
			} else {
				profiles = (response?.data as GetUsersQueryAvo).users_summary_view.map(
					(user: GetUsersQueryAvo['users_summary_view'][0]): CommonUser => ({
						profileId: user.profile_id,
						stamboek: user.stamboek || undefined,
						organisation: user.company_name
							? ({
									name: user.company_name,
							  } as Avo.Organization.Organization)
							: undefined,
						educational_organisations: (user.organisations || []).map(
							(org): ClientEducationOrganization => ({
								organizationId: org.organization_id,
								unitId: org.unit_id || null,
								label: org.organization?.ldap_description || '',
							})
						),
						subjects: user.classifications.map((classification) => classification.key),
						education_levels: user.contexts.map((context) => context.key),
						is_exception: user.is_exception || undefined,
						business_category: user.business_category || undefined,
						created_at: user.acc_created_at,
						userGroup: user.group_name || undefined,
						userId: user.user_id,
						uid: user.user_id,
						email: user.mail || undefined,
						fullName: user.full_name || undefined,
						firstName: user.first_name || undefined,
						lastName: user.last_name || undefined,
						is_blocked: user.is_blocked || undefined,
						blocked_at: get(user, 'blocked_at.date'),
						unblocked_at: get(user, 'unblocked_at.date'),
						last_access_at: user.last_access_at,
						temp_access: user?.user?.temp_access || undefined,
						idps: user.idps.map((idp) => idp.idp as unknown as Idp),
					})
				);
			}

			const profileCount =
				response?.data?.users_summary_view_aggregate?.aggregate?.count ||
				response?.data?.users_profile_aggregate?.aggregate?.count ||
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
				GetProfileNamesQueryAvo & GetProfileNamesQueryHetArchief
			>({
				query: this.getQueries().GetProfileNamesDocument,
				variables: {
					profileIds,
				},
			});

			if (response.errors) {
				throw new CustomError('Response from graphql contains errors', null, {
					response,
				});
			}

			/* istanbul ignore next */
			if (
				Config.getConfig().database.databaseApplicationType === AvoOrHetArchief.hetArchief
			) {
				return (response?.data?.users_profile || []).map(
					(
						profileEntry: GetProfileNamesQueryHetArchief['users_profile'][0]
					): Partial<CommonUser> => ({
						profileId: profileEntry.id,
						fullName: profileEntry.full_name || undefined,
						email: profileEntry.mail || undefined,
					})
				);
			} else {
				return (response?.data?.users_summary_view || []).map(
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

	static async getProfileIds(where: any = {}): Promise<string[]> {
		let variables: any;
		try {
			variables = where
				? {
						where,
				  }
				: {};
			const response = await dataService.query({
				variables,
				query: this.getQueries().GetProfileIds,
			});
			if (response.errors) {
				throw new CustomError('Response from gragpql contains errors', null, {
					response,
				});
			}
			if (Config.getConfig().database.databaseApplicationType === AvoOrHetArchief.avo) {
				return compact(
					get(response, 'data.users_summary_view' || []).map(
						(user: Partial<Avo.User.User>) => get(user, 'profile_id')
					)
				);
			}
			// archief
			return compact(
				get(response, 'data.users_profile' || []).map(
					(user: GetProfileIdsQuery['users_profile']) => get(user, 'id')
				)
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
		isBlocked: boolean
	): Promise<void> {
		if (Config.getConfig().database.databaseApplicationType === AvoOrHetArchief.hetArchief) {
			return;
		}

		let url: string | undefined;
		try {
			url = `${Config.getConfig().database.proxyUrl}/admin/user/bulk-block`;
			const body: Avo.User.BulkBlockUsersBody = {
				profileIds,
				isBlocked,
			};

			const response = await fetchWithLogout(url, {
				method: 'POST',
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

	static async fetchDistinctBusinessCategories() {
		if (Config.getConfig().database.databaseApplicationType === AvoOrHetArchief.hetArchief) {
			return [];
		}

		try {
			const response = await dataService.query({
				query: GetDistinctBusinessCategoriesDocument,
			});
			if (response.errors) {
				throw new CustomError('GraphQL query has errors', null, { response });
			}
			return get(response, 'data.users_profiles', []).map(
				(profile: Partial<Avo.User.Profile>) => profile.business_category
			);
		} catch (err) {
			throw new CustomError('Failed to get distinct business categories from profiles', err, {
				query: 'GET_DISTINCT_BUSINESS_CATEGORIES',
			});
		}
	}

	static async fetchIdps() {
		try {
			const response = await dataService.query({
				query: this.getQueries().GetIdpsDocument,
			});
			if (response.errors) {
				throw new CustomError('GraphQL query has errors', null, { response });
			}
			/* istanbul ignore next */
			if (
				Config.getConfig().database.databaseApplicationType === AvoOrHetArchief.hetArchief
			) {
				return get(response, 'data.users_identity_provider', []).map(
					(idp: { name: string }) => idp.name
				);
			}

			return get(response, 'data.users_idps', []).map((idp: { value: string }) => idp.value);
		} catch (err) {
			throw new CustomError('Failed to get idps from the database', err, {
				query: 'GET_IDPS',
			});
		}
	}

	static async bulkDeleteUsers(
		profileIds: string[],
		deleteOption: Avo.User.UserDeleteOption,
		transferToProfileId?: string
	): Promise<void> {
		let url: string | undefined;
		const isAvo = Config.getConfig().database.databaseApplicationType === AvoOrHetArchief.avo;

		try {
			url = `${Config.getConfig().database.proxyUrl}/admin/user/bulk-delete`;
			const body: Avo.User.BulkDeleteUsersBody = {
				profileIds,
				deleteOption,
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
		if (Config.getConfig().database.databaseApplicationType === AvoOrHetArchief.hetArchief) {
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
			const response = await dataService.query({
				query: GetContentCountsForUsersDocument,
				variables: {
					profileIds,
				},
			});

			if (response.errors) {
				throw new CustomError('Response from gragpql contains errors', null, {
					response,
				});
			}

			return {
				publicCollections: get(response, 'data.publicCollections.aggregate.count'),
				privateCollections: get(response, 'data.privateCollections.aggregate.count'),
				assignments: get(response, 'data.assignments.aggregate.count', '-'),
				bookmarks:
					get(response, 'data.collectionBookmarks.aggregate.count ', 0) +
					get(response, 'data.itemBookmarks.aggregate.count', 0),
				publicContentPages: get(response, 'data.publicContentPages.aggregate.count'),
				privateContentPages: get(response, 'data.privateContentPages.aggregate.count'),
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
		if (Config.getConfig().database.databaseApplicationType === AvoOrHetArchief.hetArchief) {
			return;
		}

		try {
			// First remove the subjects, so we can add them without duplicate conflicts
			await UserService.bulkRemoveSubjectsFromProfiles(subjects, profileIds);

			// Add the subjects
			const response = await dataService.query({
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
			await Config.getConfig().services.queryCache.clear('clearUserCache');

			if (response.errors) {
				throw new CustomError('GraphQL query has errors', null, { response });
			}
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
		if (Config.getConfig().database.databaseApplicationType === AvoOrHetArchief.hetArchief) {
			return;
		}

		try {
			const response = await dataService.query({
				query: BulkDeleteSubjectsFromProfilesDocument,
				variables: {
					subjects,
					profileIds,
				},
			});
			await Config.getConfig().services.queryCache.clear('clearUserCache');
			if (response.errors) {
				throw new CustomError('GraphQL query has errors', null, { response });
			}
		} catch (err) {
			throw new CustomError('Failed to bulk delete subjects from profiles', err, {
				subjects,
				profileIds,
				query: 'BULK_DELETE_SUBJECTS_FROM_PROFILES',
			});
		}
	}
}
