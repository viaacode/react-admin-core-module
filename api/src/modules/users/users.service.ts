import { forwardRef, Inject } from '@nestjs/common';
import type { AvoAuthIdpType, AvoSearchOrderDirection, AvoUserCommonUser } from '@viaa/avo2-types';
import { compact, flatten } from 'lodash';
import { DataService } from '../data';
import {
	BulkAddLomsToProfilesDocument,
	type BulkAddLomsToProfilesMutation,
	type BulkAddLomsToProfilesMutationVariables,
	BulkDeleteLomsFromProfilesDocument,
	type BulkDeleteLomsFromProfilesMutation,
	type BulkDeleteLomsFromProfilesMutationVariables,
	GetContentCountsForUsersDocument,
	type GetContentCountsForUsersQuery,
	type GetContentCountsForUsersQueryVariables,
	GetDistinctBusinessCategoriesDocument,
	type GetDistinctBusinessCategoriesQuery,
	type GetDistinctBusinessCategoriesQueryVariables,
	GetUserByIdDocument,
	type GetUserByIdQuery,
	type GetUserByIdQueryVariables,
} from '../shared/generated/graphql-db-types-avo';
import { customError } from '../shared/helpers/custom-error';
import { getOrderObject } from '../shared/helpers/generate-order-gql-query';
import { getDatabaseType } from '../shared/helpers/get-database-type';
import { isAvo } from '../shared/helpers/is-avo';
import { isHetArchief } from '../shared/helpers/is-hetarchief';
import { USER_QUERIES, type UserQueryTypes } from './queries/users.queries';
import { GET_TABLE_COLUMN_TO_DATABASE_ORDER_OBJECT } from './users.consts';
import { convertUserInfoToCommonUser } from './users.converters';
import {
	type DeleteContentCounts,
	type UserInfoOverviewAvo,
	type UserInfoOverviewHetArchief,
	UserInfoType,
	type UserOverviewTableCol,
} from './users.types';

export class UsersService {
	constructor(@Inject(forwardRef(() => DataService)) protected dataService: DataService) {}

	async getById(profileId: string): Promise<AvoUserCommonUser> {
		try {
			if (!isAvo()) {
				throw customError('Not supported for hetarchief only for avo');
			}

			const response = await this.dataService.execute<GetUserByIdQuery, GetUserByIdQueryVariables>(
				GetUserByIdDocument,
				{ id: profileId }
			);

			if (!response || !response.users_summary_view[0]) {
				throw customError('Could not fetch user', null, {
					response,
				});
			}

			return convertUserInfoToCommonUser(
				response.users_summary_view[0],
				UserInfoType.UserInfoOverviewAvo
			);
		} catch (err: any) {
			throw customError('Failed to get profiles from the database', err, {
				variables: { id: profileId },
				query: 'GetUserById',
			});
		}
	}

	async getProfiles(
		offset: number,
		limit: number,
		sortColumn: UserOverviewTableCol,
		sortOrder: AvoSearchOrderDirection,
		tableColumnDataType: string,
		where: any = {}
	): Promise<[AvoUserCommonUser[], number]> {
		let variables: any;
		try {
			// Hetarchief doesn't have a is_deleted column yet
			const whereWithoutDeleted = isHetArchief()
				? where
				: {
						...where,
						_and: [...(where?._and || []), { is_deleted: { _eq: false } }],
					};

			const query = USER_QUERIES[getDatabaseType()].GetUsersDocument;
			variables = {
				offset,
				limit,
				where: whereWithoutDeleted,
				orderBy: getOrderObject(
					sortColumn,
					sortOrder,
					tableColumnDataType,
					GET_TABLE_COLUMN_TO_DATABASE_ORDER_OBJECT()
				),
			};

			const response = await this.dataService.execute<UserQueryTypes['GetUsersQuery']>(
				query,
				variables
			);

			const avoResponse = response as UserQueryTypes['GetUsersQueryAvo'];
			const hetArchiefResponse = response as UserQueryTypes['GetUsersQueryHetArchief'];

			// Convert user format to profile format since we initially wrote the ui to deal with profiles
			const userProfileObjects = (avoResponse?.users_summary_view ||
				hetArchiefResponse?.users_profile ||
				[]) as UserInfoOverviewAvo[] | UserInfoOverviewHetArchief[];

			const profiles: AvoUserCommonUser[] = compact(
				userProfileObjects.map((userInfo) => {
					return convertUserInfoToCommonUser(
						userInfo,
						isAvo() ? UserInfoType.UserInfoOverviewAvo : UserInfoType.UserInfoOverviewHetArchief
					);
				})
			);

			const profileCount =
				avoResponse?.users_summary_view_aggregate?.aggregate?.count ||
				hetArchiefResponse?.users_profile_aggregate?.aggregate?.count ||
				0;

			if (!profiles) {
				throw customError('Response does not contain any profiles', null, {
					response,
				});
			}

			return [profiles as any[], profileCount];
		} catch (err: any) {
			throw customError('Failed to get profiles from the database', err, {
				variables,
				query: 'GET_USERS',
			});
		}
	}

	async getNamesByProfileIds(profileIds: string[]): Promise<Partial<AvoUserCommonUser>[]> {
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
					(response as UserQueryTypes['GetProfileNamesQueryHetArchief'])?.users_profile || []
				).map(
					(
						profileEntry: UserQueryTypes['GetProfileNamesQueryHetArchief']['users_profile'][0]
					): Partial<AvoUserCommonUser> => ({
						profileId: profileEntry.id,
						fullName: profileEntry.full_name || undefined,
						email: profileEntry.mail || undefined,
					})
				);
			} else {
				return (
					(response as UserQueryTypes['GetProfileNamesQueryAvo'])?.users_summary_view || []
				).map(
					(
						profileEntry: UserQueryTypes['GetProfileNamesQueryAvo']['users_summary_view'][0]
					): Partial<AvoUserCommonUser> => ({
						profileId: profileEntry.profile_id,
						fullName: profileEntry.full_name || undefined,
						email: profileEntry.mail || undefined,
					})
				);
			}
		} catch (err: any) {
			throw customError('Failed to get profile names from the database', err, {
				profileIds,
				query: 'GET_PROFILE_NAMES',
			});
		}
	}

	async getProfileIds(
		where?: UserQueryTypes['GetProfileIdsQueryVariables']['where']
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
					((response as UserQueryTypes['GetProfileIdsQueryAvo']).users_summary_view || []).map(
						(user) => user?.profile_id
					)
				);
			}
			// archief
			return compact(
				((response as UserQueryTypes['GetProfileIdsQueryHetArchief']).users_profile || []).map(
					(user) => user?.id
				)
			);
		} catch (err: any) {
			throw customError('Failed to get profile ids from the database', err, {
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

			return compact((response.users_profiles || []).map((profile) => profile.business_category));
		} catch (err: any) {
			throw customError('Failed to get distinct business categories from profiles', err, {
				query: 'GET_DISTINCT_BUSINESS_CATEGORIES',
			});
		}
	}

	async fetchIdps(): Promise<AvoAuthIdpType[]> {
		try {
			const response = await this.dataService.execute<
				UserQueryTypes['GetIdpsQuery'],
				UserQueryTypes['GetIdpsQueryVariables']
			>(USER_QUERIES[getDatabaseType()].GetIdpsDocument);

			/* istanbul ignore next */
			if (isHetArchief()) {
				return (
					(response as UserQueryTypes['GetIdpsQueryHetArchief']).users_identity_provider || []
				).map((idp) => idp.name as AvoAuthIdpType);
			}

			return ((response as UserQueryTypes['GetIdpsQueryAvo']).users_idps || []).map(
				(idp) => idp.value as AvoAuthIdpType
			);
		} catch (err: any) {
			throw customError('Failed to get idps from the database', err, {
				query: 'GET_IDPS',
			});
		}
	}

	async fetchPublicAndPrivateCounts(profileIds: string[]): Promise<DeleteContentCounts> {
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
			const response = await this.dataService.execute<
				GetContentCountsForUsersQuery,
				GetContentCountsForUsersQueryVariables
			>(GetContentCountsForUsersDocument, {
				profileIds,
			});

			return {
				publicCollections: response.publicCollections?.aggregate?.count || 0,
				privateCollections: response.privateCollections?.aggregate?.count || 0,
				publicBundles: response.publicBundles?.aggregate?.count || 0,
				privateBundles: response.privateBundles?.aggregate?.count || 0,
				publicAssignments: response.publicAssignments?.aggregate?.count || 0,
				publicAssignmentPupilCollections:
					response.publicAssignmentPupilCollections?.aggregate?.count || 0,
				privateAssignments: response.privateAssignments?.aggregate?.count || 0,
				privateAssignmentPupilCollections:
					response.privateAssignmentPupilCollections?.aggregate?.count || 0,
				publicContentPages: response.publicContentPages?.aggregate?.count || 0,
				privateContentPages: response.privateContentPages?.aggregate?.count || 0,
				bookmarks:
					(response.collectionBookmarks?.aggregate?.count || 0) +
					(response.itemBookmarks?.aggregate?.count || 0),
				quickLanes: response.quickLanes?.aggregate?.count || 0,
			};
		} catch (err: any) {
			throw customError('Failed to get content counts for users from the database', err, {
				profileIds,
				query: 'GetContentCountsForUsers',
			});
		}
	}

	async bulkAddLomsToProfiles(lomIds: string[], profileIds: string[]): Promise<void> {
		if (isHetArchief()) {
			console.info("adding subjects to profiles isn't supported for hetarchief");
			return;
		}

		try {
			// First remove the subjects, so we can add them without duplicate conflicts
			await this.bulkRemoveLomsFromProfiles(lomIds, profileIds);

			// Add the subjects
			await this.dataService.execute<
				BulkAddLomsToProfilesMutation,
				BulkAddLomsToProfilesMutationVariables
			>(BulkAddLomsToProfilesDocument, {
				loms: flatten(
					lomIds.map((lomId) =>
						profileIds.map((profileId) => ({
							lom_id: lomId,
							profile_id: profileId,
						}))
					)
				),
			});
		} catch (err: any) {
			throw customError('Failed to bulk add loms to profiles', err, {
				lomIds,
				profileIds,
				query: 'BulkAddLomsToProfiles',
			});
		}
	}

	async bulkRemoveLomsFromProfiles(lomIds: string[], profileIds: string[]): Promise<void> {
		if (isHetArchief()) {
			console.info("removing loms from profiles isn't supported for hetarchief");
			return;
		}

		try {
			await this.dataService.execute<
				BulkDeleteLomsFromProfilesMutation,
				BulkDeleteLomsFromProfilesMutationVariables
			>(BulkDeleteLomsFromProfilesDocument, {
				lomIds,
				profileIds,
			});
		} catch (err: any) {
			throw customError('Failed to bulk delete loms from profiles', err, {
				lomIds,
				profileIds,
				query: 'BulkDeleteLomsFromProfiles',
			});
		}
	}
}
