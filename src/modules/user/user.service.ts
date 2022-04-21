import { Avo } from '@viaa/avo2-types';
import { ClientEducationOrganization } from '@viaa/avo2-types/types/education-organizations';
import { get } from 'lodash-es';
import { Config } from '~core/config';

import {
	GetProfileNamesQuery as GetProfileNamesQueryAvo,
	GetUsersQuery as GetUsersQueryAvo,
} from '~generated/graphql-db-types-avo';
import {
	GetProfileNamesQuery as GetProfileNamesQueryHetArchief,
	GetUsersQuery as GetUsersQueryHetArchief,
} from '~generated/graphql-db-types-hetarchief';
import { getOrderObject } from '~modules/shared/helpers/generate-order-gql-query';
import { AvoOrHetArchief } from '~modules/shared/types';
import { USER_QUERIES } from '~modules/user/queries/users.queries';

import { TABLE_COLUMN_TO_DATABASE_ORDER_OBJECT } from '../content-page/const/content-page.consts';
import { CustomError } from '../shared/helpers/custom-error';
import { dataService } from '../shared/services/data-service';

import { ITEMS_PER_PAGE } from './user.consts';
import { CommonUser, Idp, UserOverviewTableCol } from './user.types';

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
	): Promise<[Avo.User.Profile[], number]> {
		let variables: any;
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
					TABLE_COLUMN_TO_DATABASE_ORDER_OBJECT
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
							userGroup: user.group_id,
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
}
