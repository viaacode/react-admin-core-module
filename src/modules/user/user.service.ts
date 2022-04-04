import { getOrderObject } from '@shared/helpers/generate-order-gql-query';
import { Avo } from '@viaa/avo2-types';
import { ClientEducationOrganization } from '@viaa/avo2-types/types/education-organizations';
import { get, isNil } from 'lodash-es';

import { TABLE_COLUMN_TO_DATABASE_ORDER_OBJECT } from '../content-page/const/content-page.consts';
import { CustomError } from '../shared/helpers/custom-error';
import { dataService, GraphQlResponse } from '../shared/services/data-service';

import { ITEMS_PER_PAGE } from './user.consts';
import { DeleteContentCountsRaw, UserOverviewTableCol, UserSummaryView } from './user.types';

import { GetProfileNamesDocument, GetUsersDocument } from '~generated/graphql-db-types-avo';

export class UserService {
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
			const whereWithoutDeleted = {
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

			const response = await dataService.query({
				variables,
				query: GetUsersDocument,
			});

			if (response.errors) {
				throw new CustomError('Response from gragpql contains errors', null, {
					response,
				});
			}

			const users: UserSummaryView[] = get(response, 'data.users_summary_view');

			// Convert user format to profile format since we initially wrote the ui to deal with profiles
			const profiles: Partial<Avo.User.Profile>[] = users.map(
				(user: UserSummaryView): Avo.User.Profile =>
					({
						id: user.profile_id,
						stamboek: user.stamboek,
						organisation: user.company_name
							? ({
									name: user.company_name,
							  } as Avo.Organization.Organization)
							: null,
						educational_organisations: user.organisations.map(
							(org): ClientEducationOrganization => ({
								organizationId: org.organization_id,
								unitId: org.unit_id || null,
								label: org.organization?.ldap_description || '',
							})
						),
						subjects: user.classifications.map((classification) => classification.key),
						education_levels: user.contexts.map((context) => context.key),
						is_exception: user.is_exception,
						business_category: user.business_category,
						created_at: user.acc_created_at,
						userGroupIds: isNil(user.group_id) ? [] : [user.group_id],
						user_id: user.user_id,
						profile_user_group: {
							group: {
								label: user.group_name,
								id: user.group_id,
							},
						},
						user: {
							uid: user.user_id,
							mail: user.mail,
							full_name: user.full_name,
							first_name: user.first_name,
							last_name: user.last_name,
							is_blocked: user.is_blocked,
							blocked_at: get(user, 'blocked_at.date'),
							unblocked_at: get(user, 'unblocked_at.date'),
							created_at: user.acc_created_at,
							last_access_at: user.last_access_at,
							temp_access: user.user.temp_access,
							idpmaps: user.idps.map((idp) => idp.idp),
						},
					} as any)
			);

			const profileCount = get(response, 'data.users_summary_view_aggregate.aggregate.count');

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

	static async getNamesByProfileIds(profileIds: string[]): Promise<Avo.User.User[]> {
		try {
			const response: GraphQlResponse<DeleteContentCountsRaw> =
				await dataService.query<DeleteContentCountsRaw>({
					query: GetProfileNamesDocument,
					variables: {
						profileIds,
					},
				});

			if (response.errors) {
				throw new CustomError('Response from gragpql contains errors', null, {
					response,
				});
			}

			return get(response, 'data.users_summary_view').map((profileEntry: any) => ({
				profile: {
					id: profileEntry.profile_id,
				},
				full_name: profileEntry.full_name,
				mail: profileEntry.mail,
			}));
		} catch (err) {
			throw new CustomError('Failed to get profile names from the database', err, {
				profileIds,
				query: 'GET_PROFILE_NAMES',
			});
		}
	}
}
