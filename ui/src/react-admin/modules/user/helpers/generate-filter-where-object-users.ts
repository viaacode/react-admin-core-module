import { isNil, without } from 'es-toolkit';
import { ToastType } from '~core/config/config.types.js';
import type { UserTableState } from '~modules/user/user.types.js';
import { LomScheme } from '~shared/consts/lom-scheme.enum.js';
import { CustomError } from '~shared/helpers/custom-error.js';
import { eduOrgToClientOrg } from '~shared/helpers/edu-org-string-to-client-org.js';
import {
	getBooleanFilters,
	getDateRangeFilters,
	getLomFilter,
	getMultiOptionFilters,
	getMultiOptionsFilters,
	NULL_FILTER,
} from '~shared/helpers/filters.js';
import { showToast } from '~shared/helpers/show-toast.js';

export const generateWhereObjectAvo = (
	filters: Partial<UserTableState>,
	onlySelectedProfiles: boolean,
	theSelectedProfileIds: string[]
) => {
	try {
		// biome-ignore lint/suspicious/noExplicitAny: todo
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

		andFilters.push(
			...getBooleanFilters<Partial<UserTableState>>(
				filters,
				['isBlocked', 'isException'],
				['is_blocked', 'is_exception']
			)
		);

		andFilters.push(
			...getDateRangeFilters<Partial<UserTableState>>(
				filters,
				['blockedAt', 'unblockedAt'],
				['blocked_at.max', 'unblocked_at.max']
			)
		);

		andFilters.push(
			...getMultiOptionFilters<Partial<UserTableState>>(
				filters,
				['userGroup', 'organisation', 'businessCategory'],
				['group_id', 'company_id', 'business_category']
			)
		);

		andFilters.push(...getLomFilter(filters.educationLevels, LomScheme.education));
		andFilters.push(...getLomFilter(filters.subjects, LomScheme.subject));

		andFilters.push(
			...getMultiOptionsFilters<Partial<UserTableState>>(
				filters,
				['idps'],
				['idps.idp'],
				undefined,
				true
			)
		);

		andFilters.push(
			...getMultiOptionFilters<Partial<UserTableState>>(
				filters,
				['tempAccess'],
				['profile.temp_access.has_currently_access.status']
			)
		);

		andFilters.push(
			...getDateRangeFilters<Partial<UserTableState>>(
				filters,
				['createdAt', 'lastAccessAt'],
				['acc_created_at', 'last_access_at']
			)
		);

		if (filters.educationalOrganisations?.length) {
			// biome-ignore lint/suspicious/noExplicitAny: todo
			const orFilters: any[] = [];

			eduOrgToClientOrg(without(filters.educationalOrganisations, NULL_FILTER)).forEach((org) => {
				orFilters.push({
					organisations: {
						organization_id: { _eq: org.organisationId },
						unit_id: org.unitId ? { _eq: org.unitId } : { _is_null: true },
					},
				});
			});

			if (filters.educationalOrganisations.includes(NULL_FILTER)) {
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
			const hasStamboek = filters.stamboek?.[0] === 'true';
			const isStamboekNull = !hasStamboek;

			andFilters.push({ stamboek: { _is_null: isStamboekNull } });
		}

		return { _and: andFilters };
	} catch (err) {
		console.error(
			new CustomError(
				'An error occurred while generating the where object for filtering users',
				err,
				{ filters }
			)
		);
		showToast({
			title: 'Het opbouwen van de filters voor de gebruikers is mislukt',
			type: ToastType.ERROR,
		});
	}
};

export const generateWhereObjectArchief = (
	filters: Partial<UserTableState>,
	onlySelectedProfiles: boolean,
	theSelectedProfileIds: string[]
) => {
	try {
		// biome-ignore lint/suspicious/noExplicitAny: todo
		const andFilters: any[] = [];

		if (filters.query) {
			const query = `%${filters.query}%`;

			andFilters.push({
				_or: [
					{ mail: { _ilike: query } },
					{ full_name: { _ilike: query } },
					{
						organisation: {
							skos_pref_label: {
								_ilike: query,
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

		if (!isNil(filters.isKeyUser)) {
			andFilters.push(
				...getBooleanFilters<Partial<UserTableState>>(filters, ['isKeyUser'], ['is_key_user'])
			);
		}

		andFilters.push(...getMultiOptionFilters(filters, ['userGroup'], ['group_id']));

		andFilters.push(
			...getMultiOptionsFilters(
				filters,
				['idps', 'organisation'],
				['identities', 'organisation'],
				['identity_provider_name', 'org_identifier'],
				true
			)
		);

		andFilters.push(...getDateRangeFilters(filters, ['lastAccessAt'], ['last_access_at']));

		if (onlySelectedProfiles) {
			andFilters.push({ profile_id: { _in: theSelectedProfileIds } });
		}

		return { _and: andFilters };
	} catch (err) {
		console.error(
			new CustomError(
				'An error occurred while generating the where object for filtering users',
				err,
				{ filters }
			)
		);
		showToast({
			title: 'Het opbouwen van de filters voor de gebruikers is mislukt',
			type: ToastType.ERROR,
		});
	}
};
