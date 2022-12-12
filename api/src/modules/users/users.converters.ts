import { isNil } from "@nestjs/common/utils/shared.utils";
import { Avo } from "@viaa/avo2-types";
import { ClientEducationOrganization } from "@viaa/avo2-types/types/education-organizations";
import { Idp } from "../shared/auth/auth.types";
import { isHetArchief } from "../shared/helpers/is-hetarchief";
import { CommonUser, HetArchiefUser, ProfileAvo, ProfileHetArchief } from "./users.types";

export function convertProfileToCommonUser(
	userProfile: ProfileAvo | ProfileHetArchief | Avo.User.User | HetArchiefUser | undefined,
): CommonUser | undefined {
	if (!userProfile) {
		return undefined;
	}
	if (isHetArchief()) {
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
			lastAccessAt: user.last_access_at,
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
			educationalOrganisations: (user.organisations || []).map(
				(org): ClientEducationOrganization => ({
					organizationId: org.organization_id,
					unitId: org.unit_id || null,
					label: org.organization?.ldap_description || '',
				}),
			),
			subjects: user.classifications?.map(
				(classification) => classification.key,
			),
			educationLevels: user.contexts?.map((context) => context.key),
			isException: user.is_exception || undefined,
			businessCategory: user.business_category || undefined,
			createdAt: user.acc_created_at,
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
			isBlocked: user.is_blocked || undefined,
			blockedAt: user?.blocked_at?.date,
			unblockedAt: user?.unblocked_at?.date,
			lastAccessAt: user.last_access_at,
			tempAccess: user?.user?.temp_access
				? {
					from: user?.user?.temp_access?.from || null,
					until: user?.user?.temp_access?.until || null,
					status: isNil(user?.user?.temp_access?.current?.status)
						? null
						: user?.user?.temp_access?.current?.status === 1,
				}
				: null,
			idps: user.idps?.map((idp) => idp.idp as unknown as Idp),
		};
	}
}

export function convertAvoUserToCommonUser(avoUser?: Avo.User.User | null): CommonUser | null {
	if (!avoUser || !avoUser.profile) {
		return null;
	}
	return {
		profileId: avoUser.profile.id,
		stamboek: avoUser.profile.stamboek || undefined,
		organisation: avoUser.profile.organisation
			? ({
				name: avoUser.profile.organisation.name,
			} as Avo.Organization.Organization)
			: undefined,
		educationalOrganisations: (avoUser.profile.organizations || []).map(
			(org): Avo.EducationOrganization.Organization => ({
				organizationId: null as any, // TODO fetch org id everywhere
				unitId: null,
				label: org.organizationName || '',
			})
		),
		subjects: avoUser.profile.subjects,
		educationLevels: avoUser.profile.educationLevels,
		isException: avoUser.profile.is_exception || undefined,
		businessCategory: avoUser.profile.business_category || undefined,
		createdAt: avoUser.created_at,
		userGroup: {
			name: undefined,
			label: undefined,
			id: avoUser.profile.userGroupIds[0] || undefined,
		},
		userId: avoUser.uid,
		uid: avoUser.uid,
		email: avoUser.mail || undefined,
		fullName: avoUser.full_name || undefined,
		firstName: avoUser.first_name || undefined,
		lastName: avoUser.last_name || undefined,
		isBlocked: avoUser.is_blocked || undefined,
		blockedAt: undefined, // TODO fetch value if needed
		unblockedAt: undefined, // TODO fetch value if needed
		lastAccessAt: avoUser.last_access_at || undefined,
		tempAccess: avoUser?.temp_access
			? {
				from: avoUser?.temp_access?.from || null,
				until: avoUser?.temp_access?.until || null,
				status: isNil(avoUser?.temp_access?.status)
					? null
					: avoUser?.temp_access?.status,
			}
			: undefined,
		idps: avoUser.idpmaps as Idp[],
	};
}
