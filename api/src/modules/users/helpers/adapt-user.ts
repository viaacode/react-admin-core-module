import { Avo } from '@viaa/avo2-types';
import { ClientEducationOrganization } from '@viaa/avo2-types/types/education-organizations';
import { AvoOrHetArchief } from '../../content-pages';
import { CommonUser, Idp, ProfileAvo, ProfileHetArchief } from '../types';

export function adaptProfile(
	userProfile: ProfileAvo | ProfileHetArchief | undefined,
): CommonUser | undefined {
	if (!userProfile) {
		return undefined;
	}
	if (process.env.DATABASE_APPLICATION_TYPE === AvoOrHetArchief.hetArchief) {
		const user = userProfile as ProfileHetArchief;
		return {
			profileId: user.id,
			email: user.mail || undefined,
			firstName: user.first_name || undefined,
			lastName: user.last_name || undefined,
			fullName: user.full_name || undefined,
			userGroup: {
				id: user.group?.id,
				name: user.group?.name,
				label: user.group?.label,
			},
			idps: user.identities?.map(
				(identity) => identity.identity_provider_name as Idp,
			),
			organisation: {
				name:
					user.maintainer_users_profiles?.[0]?.maintainer.schema_name ||
					undefined,
				or_id:
					user.maintainer_users_profiles?.[0]?.maintainer.schema_identifier,
				logo_url:
					user.maintainer_users_profiles?.[0]?.maintainer?.information?.logo
						?.iri,
			},
			last_access_at: user.last_access_at,
		};
	} else {
		const user = userProfile as ProfileAvo;
		return {
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
				}),
			),
			subjects: user.classifications?.map(
				(classification) => classification.key,
			),
			education_levels: user.contexts?.map((context) => context.key),
			is_exception: user.is_exception || undefined,
			business_category: user.business_category || undefined,
			created_at: user.acc_created_at,
			userGroup: {
				name: user.group_name || undefined,
				label: user.group_name || undefined,
				id: user.group_id || undefined,
			},
			userId: user.user_id,
			uid: user.user_id,
			email: user.mail || undefined,
			fullName: user.full_name || undefined,
			firstName: user.first_name || undefined,
			lastName: user.last_name || undefined,
			is_blocked: user.is_blocked || undefined,
			blocked_at: user?.blocked_at?.date,
			unblocked_at: user?.unblocked_at?.date,
			last_access_at: user.last_access_at,
			temp_access: user?.user?.temp_access || undefined,
			idps: user.idps?.map((idp) => idp.idp as unknown as Idp),
		};
	}
}
