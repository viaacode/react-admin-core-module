import { forwardRef, Inject } from '@nestjs/common';
import type { Avo } from '@viaa/avo2-types';
import { compact, flatten } from 'lodash';
import { DataService } from '../data';
import {
	BulkAddSubjectsToProfilesDocument,
	BulkAddSubjectsToProfilesMutation,
	BulkAddSubjectsToProfilesMutationVariables,
	BulkDeleteSubjectsFromProfilesDocument,
	BulkDeleteSubjectsFromProfilesMutation,
	BulkDeleteSubjectsFromProfilesMutationVariables,
	GetContentCountsForUsersDocument,
	GetContentCountsForUsersQuery,
	GetContentCountsForUsersQueryVariables,
	GetDistinctBusinessCategoriesDocument,
	GetDistinctBusinessCategoriesQuery,
	GetDistinctBusinessCategoriesQueryVariables,
	GetUserByIdDocument,
	GetUserByIdQuery,
	GetUserByIdQueryVariables,
} from '../shared/generated/graphql-db-types-avo';

import { CustomError } from '../shared/helpers/custom-error';
import { getOrderObject } from '../shared/helpers/generate-order-gql-query';
import { getDatabaseType } from '../shared/helpers/get-database-type';
import { isAvo } from '../shared/helpers/is-avo';
import { isHetArchief } from '../shared/helpers/is-hetarchief';
import { USER_QUERIES, UserQueryTypes } from './queries/users.queries';
import { GET_TABLE_COLUMN_TO_DATABASE_ORDER_OBJECT } from './users.consts';
import { convertUserInfoToCommonUser } from './users.converters';
import {
	CommonUser,
	DeleteContentCounts,
	UserInfoOverviewAvo,
	UserInfoOverviewHetArchief,
	UserInfoType,
	UserOverviewTableCol,
} from './users.types';

export class UsersService {
	constructor(
		@Inject(forwardRef(() => DataService)) protected dataService: DataService,
	) {}

	async getById(id: string): Promise<CommonUser> {
		try {
			if (!isAvo()) {
				throw CustomError('Not supported');
			}

			const response = await this.dataService.execute<
				GetUserByIdQuery,
				GetUserByIdQueryVariables
			>(GetUserByIdDocument, { id });

			if (!response || !response.users_summary_view[0]) {
				throw CustomError('Could not fetch user', null, {
					response,
				});
			}

			return convertUserInfoToCommonUser(
				response.users_summary_view[0],
				UserInfoType.UserInfoOverviewAvo,
			);
		} catch (err) {
			throw CustomError('Failed to get profiles from the database', err, {
				variables: { id },
				query: 'GET_USERS',
			});
		}
	}

	async getProfiles(
		offset: number,
		limit: number,
		sortColumn: UserOverviewTableCol,
		sortOrder: Avo.Search.OrderDirection,
		tableColumnDataType: string,
		where: any = {},
	): Promise<[CommonUser[], number]> {
		let variables: any;
		try {
			// Hetarchief doesn't have a is_deleted column yet
			const whereWithoutDeleted = isHetArchief()
				? where
				: {
						...where,
						is_deleted: { _eq: false },
				  };

			variables = {
				offset,
				limit,
				where: whereWithoutDeleted,
				orderBy: getOrderObject(
					sortColumn,
					sortOrder,
					tableColumnDataType,
					GET_TABLE_COLUMN_TO_DATABASE_ORDER_OBJECT(),
				),
			};

			const response = await this.dataService.execute<
				UserQueryTypes['GetUsersQuery']
			>(USER_QUERIES[getDatabaseType()].GetUsersDocument, variables);

			const avoResponse = response as UserQueryTypes['GetProfileNamesQueryAvo'];
			const hetArchiefResponse =
				response as UserQueryTypes['GetProfileNamesQueryHetArchief'];

			// Convert user format to profile format since we initially wrote the ui to deal with profiles
			const userProfileObjects = (avoResponse?.users_summary_view ||
				hetArchiefResponse?.users_profile ||
				[]) as UserInfoOverviewAvo[] | UserInfoOverviewHetArchief[];
			const profiles: CommonUser[] = compact(
				userProfileObjects.map((userInfo) => {
					return convertUserInfoToCommonUser(
						userInfo,
						isAvo()
							? UserInfoType.UserInfoOverviewAvo
							: UserInfoType.UserInfoOverviewHetArchief,
					);
				}),
			);

			const profileCount =
				avoResponse?.users_summary_view_aggregate?.aggregate?.count ||
				hetArchiefResponse?.users_profile_aggregate?.aggregate?.count ||
				0;

			if (!profiles) {
				throw CustomError('Response does not contain any profiles', null, {
					response,
				});
			}

			return [profiles as any[], profileCount];
		} catch (err) {
			throw CustomError('Failed to get profiles from the database', err, {
				variables,
				query: 'GET_USERS',
			});
		}
	}

	async getNamesByProfileIds(
		profileIds: string[],
	): Promise<Partial<CommonUser>[]> {
		try {
			const response = await this.dataService.execute<
				UserQueryTypes['GetProfileNamesQuery'],
				UserQueryTypes['GetProfileNamesQueryVariables']
			>(USER_QUERIES[getDatabaseType()].GetProfileNamesDocument, {
				profileIds,
			});

			/* istanbul ignore next */
			if (isHetArchief()) {
				return (
					(response as UserQueryTypes['GetProfileNamesQueryHetArchief'])
						?.users_profile || []
				).map(
					(
						profileEntry: UserQueryTypes['GetProfileNamesQueryHetArchief']['users_profile'][0],
					): Partial<CommonUser> => ({
						profileId: profileEntry.id,
						fullName: profileEntry.full_name || undefined,
						email: profileEntry.mail || undefined,
					}),
				);
			} else {
				return (
					(response as UserQueryTypes['GetProfileNamesQueryAvo'])
						?.users_summary_view || []
				).map(
					(
						profileEntry: UserQueryTypes['GetProfileNamesQueryAvo']['users_summary_view'][0],
					): Partial<CommonUser> => ({
						profileId: profileEntry.profile_id,
						fullName: profileEntry.full_name || undefined,
						email: profileEntry.mail || undefined,
					}),
				);
			}
		} catch (err) {
			throw CustomError('Failed to get profile names from the database', err, {
				profileIds,
				query: 'GET_PROFILE_NAMES',
			});
		}
	}

	async getProfileIds(
		where?: UserQueryTypes['GetProfileIdsQueryVariables']['where'],
	): Promise<string[]> {
		let variables: UserQueryTypes['GetProfileIdsQueryVariables'] | null = null;
		try {
			variables = {
				where: where || {},
			};
			const response = await this.dataService.execute<
				UserQueryTypes['GetProfileIdsQuery'],
				UserQueryTypes['GetProfileIdsQueryVariables']
			>(USER_QUERIES[getDatabaseType()].GetProfileIdsDocument, variables);

			if (isAvo()) {
				// avo
				return compact(
					(
						(response as UserQueryTypes['GetProfileIdsQueryAvo'])
							.users_summary_view || []
					).map((user) => user?.profile_id),
				);
			}
			// archief
			return compact(
				(
					(response as UserQueryTypes['GetProfileIdsQueryHetArchief'])
						.users_profile || []
				).map((user) => user?.id),
			);
		} catch (err) {
			throw CustomError('Failed to get profile ids from the database', err, {
				variables,
				query: 'GET_PROFILE_IDS',
			});
		}
	}

	async fetchDistinctBusinessCategories(): Promise<string[]> {
		if (isHetArchief()) {
			return [];
		}

		try {
			const response = await this.dataService.execute<
				GetDistinctBusinessCategoriesQuery,
				GetDistinctBusinessCategoriesQueryVariables
			>(GetDistinctBusinessCategoriesDocument);

			return compact(
				(response.users_profiles || []).map(
					(profile) => profile.business_category,
				),
			);
		} catch (err) {
			throw CustomError(
				'Failed to get distinct business categories from profiles',
				err,
				{
					query: 'GET_DISTINCT_BUSINESS_CATEGORIES',
				},
			);
		}
	}

	async fetchIdps() {
		try {
			const response = await this.dataService.execute<
				UserQueryTypes['GetIdpsQuery'],
				UserQueryTypes['GetIdpsQueryVariables']
			>(USER_QUERIES[getDatabaseType()].GetIdpsDocument);

			/* istanbul ignore next */
			if (isHetArchief()) {
				return (
					(response as UserQueryTypes['GetIdpsQueryHetArchief'])
						.users_identity_provider || []
				).map((idp) => idp.name);
			}

			return (
				(response as UserQueryTypes['GetIdpsQueryAvo']).users_idps || []
			).map((idp) => idp.value);
		} catch (err) {
			throw CustomError('Failed to get idps from the database', err, {
				query: 'GET_IDPS',
			});
		}
	}

	async fetchPublicAndPrivateCounts(
		profileIds: string[],
	): Promise<DeleteContentCounts> {
		if (isHetArchief()) {
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
			const response = await this.dataService.execute<
				GetContentCountsForUsersQuery,
				GetContentCountsForUsersQueryVariables
			>(GetContentCountsForUsersDocument, {
				profileIds,
			});

			return {
				publicCollections: response.publicCollections?.aggregate?.count || 0,
				privateCollections: response.privateCollections?.aggregate?.count || 0,
				assignments: response.assignments?.aggregate?.count || 0,
				bookmarks:
					(response.collectionBookmarks?.aggregate?.count || 0) +
					(response.itemBookmarks?.aggregate?.count || 0),
				publicContentPages: response.publicContentPages?.aggregate?.count || 0,
				privateContentPages:
					response.privateContentPages?.aggregate?.count || 0,
			};
		} catch (err) {
			throw CustomError(
				'Failed to get content counts for users from the database',
				err,
				{
					profileIds,
					query: 'GET_CONTENT_COUNTS_FOR_USERS',
				},
			);
		}
	}

	async bulkAddSubjectsToProfiles(
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
			// First remove the subjects, so we can add them without duplicate conflicts
			await this.bulkRemoveSubjectsFromProfiles(subjects, profileIds);

			// Add the subjects
			await this.dataService.execute<
				BulkAddSubjectsToProfilesMutation,
				BulkAddSubjectsToProfilesMutationVariables
			>(BulkAddSubjectsToProfilesDocument, {
				subjects: flatten(
					subjects.map((subject) =>
						profileIds.map((profileId) => ({
							key: subject,
							profile_id: profileId,
						})),
					),
				),
			});
		} catch (err) {
			throw CustomError('Failed to bulk add subjects to profiles', err, {
				subjects,
				profileIds,
				query: 'BULK_ADD_SUBJECTS_TO_PROFILES',
			});
		}
	}

	async bulkRemoveSubjectsFromProfiles(
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
			await this.dataService.execute<
				BulkDeleteSubjectsFromProfilesMutation,
				BulkDeleteSubjectsFromProfilesMutationVariables
			>(BulkDeleteSubjectsFromProfilesDocument, {
				subjects,
				profileIds,
			});
		} catch (err) {
			throw CustomError('Failed to bulk delete subjects from profiles', err, {
				subjects,
				profileIds,
				query: 'BULK_DELETE_SUBJECTS_FROM_PROFILES',
			});
		}
	}
}
