import { first, isNil, without } from 'lodash-es';
import { eduOrgToClientOrg } from '~modules/shared/helpers/edu-org-string-to-client-org';
import { getBooleanFilters, getDateRangeFilters, getMultiOptionFilters, getMultiOptionsFilters, NULL_FILTER } from '~modules/shared/helpers/filters';
import { UserTableState } from '~modules/user/user.types';

export const generateWhereObjectAvo = (
	filters: Partial<UserTableState>,
	onlySelectedProfiles: boolean,
	theSelectedProfileIds: string[]
) => {
	const andFilters: any[] = [];

	if (filters.query) {
		const query = `%${filters.query}%`;

		andFilters.push({
			_or: [
				{ stamboek: { _ilike: query } },
				{ mail: { _ilike: query } },
				{ full_name: { _ilike: query } },
				{ company_name: { _ilike: query } },
				{ group_name: { _ilike: query } },
				{ business_category: { _ilike: query } },
			],
		});
	}

	andFilters.push(...getBooleanFilters(filters, ['is_blocked', 'is_exception']));

	andFilters.push(
		...getDateRangeFilters(
			filters,
			['blocked_at', 'unblocked_at'],
			['blocked_at.max', 'unblocked_at.max']
		)
	);

	andFilters.push(
		...getMultiOptionFilters(
			filters,
			['userGroup', 'organisation', 'business_category'],
			['group_id', 'company_id', 'business_category']
		)
	);

	andFilters.push(
		...getMultiOptionsFilters(
			filters,
			['education_levels', 'subjects', 'idps'],
			['contexts', 'classifications', 'idps'],
			['key', 'key', 'idp'],
			true
		)
	);

	andFilters.push(
		...getMultiOptionFilters(filters, ['temp_access'], ['user.temp_access.current.status'])
	);

	andFilters.push(
		...getDateRangeFilters(
			filters,
			['created_at', 'last_access_at'],
			['acc_created_at', 'last_access_at']
		)
	);

	if (filters.educational_organisations && filters.educational_organisations.length) {
		const orFilters: any[] = [];

		eduOrgToClientOrg(without(filters.educational_organisations, NULL_FILTER)).forEach(
			(org) => {
				orFilters.push({
					organisations: {
						organization_id: { _eq: org.organizationId },
						unit_id: org.unitId ? { _eq: org.unitId } : { _is_null: true },
					},
				});
			}
		);

		if (filters.educational_organisations.includes(NULL_FILTER)) {
			orFilters.push({
				_not: {
					organisations: {},
				},
			});
		}

		andFilters.push({
			_or: orFilters,
		});
	}

	if (onlySelectedProfiles) {
		andFilters.push({ profile_id: { _in: theSelectedProfileIds } });
	}

	// Filter users by whether the user has a Stamboeknummer or not.
	if (!isNil(filters.stamboek)) {
		const hasStamboek = first(filters.stamboek) === 'true';
		const isStamboekNull = !hasStamboek;

		andFilters.push({ stamboek: { _is_null: isStamboekNull } });
	}

	return { _and: andFilters };
};

export const generateWhereObjectArchief = (
	filters: Partial<UserTableState>,
	onlySelectedProfiles: boolean,
	theSelectedProfileIds: string[]
) => {
	const andFilters: any[] = [];

	if (filters.query) {
		const query = `%${filters.query}%`;

		andFilters.push({
			_or: [
				{ mail: { _ilike: query } },
				{ full_name: { _ilike: query } },
				{
					maintainer_users_profiles: {
						maintainer: {
							schema_name: {
								_ilike: query,
							},
						},
					},
				},
				{
					group: {
						label: {
							_ilike: query,
						},
					},
				},
			],
		});
	}

	andFilters.push(...getMultiOptionFilters(filters, ['userGroup'], ['group_id']));

	andFilters.push(
		...getMultiOptionsFilters(
			filters,
			['idps', 'organisation'],
			['identities', 'maintainer_users_profiles'],
			['identity_provider_name', 'maintainer_identifier'],
			true
		)
	);

	andFilters.push(...getDateRangeFilters(filters, ['last_access_at'], ['last_access_at']));

	if (onlySelectedProfiles) {
		andFilters.push({ profile_id: { _in: theSelectedProfileIds } });
	}

	return { _and: andFilters };
};
