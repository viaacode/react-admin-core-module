import { isNil } from "@nestjs/common/utils/shared.utils";
import { Avo } from "@viaa/avo2-types";
import { Idp } from "../shared/auth/auth.types";
import { CommonUser, HetArchiefUser, UserInfoOverviewAvo, UserInfoOverviewHetArchief, UserInfoType } from "./users.types";

/**
 * This function should convert all user info objects to a single format
 *
 * Existing user info objects are:
 * - Avo.User.User
 * - Avo.User.Profile
 * - UserInfoOverviewAvo
 * - UserInfoOverviewHetArchief
 * - HetArchiefUser (already mapped to camelCase by the hetarchief proxy service)
 *
 * @param userInfo
 * @param userInfoType
 */
export function convertUserInfoToCommonUser(
	userInfo: Avo.User.User | Avo.User.Profile | UserInfoOverviewAvo | UserInfoOverviewHetArchief | HetArchiefUser | undefined,
	userInfoType: UserInfoType,
): CommonUser | undefined {
	if (!userInfo) {
		return undefined;
	}
	switch (userInfoType) {
		case UserInfoType.AvoUserUser: {
			// Avo.User.User: Avo user object with linked profile
			const user = userInfo as Avo.User.User;
			return {
				profileId: user.profile.id,
				stamboek: user.profile.stamboek ?? undefined,
				organisation: user.profile?.organisation,
				educationalOrganisations: (user.profile?.organizations ?? []).map(
					(org): Avo.EducationOrganization.Organization => ({
						organizationId: undefined,
						unitId: org?.unitAddress ?? null,
						label: org?.organizationName,
					}),
				),
				subjects: user.profile.subjects,
				educationLevels: user.profile.educationLevels,
				isException: user.profile.is_exception ?? undefined,
				businessCategory: user.profile.business_category ?? undefined,
				createdAt: user.profile.created_at,
				userGroup: {
					name: undefined,
					label: undefined,
					id: user.profile.userGroupIds[0] ?? undefined,
				},
				userId: user.uid,
				uid: user.uid,
				email: user.mail ?? undefined,
				fullName: user.full_name ?? undefined,
				firstName: user.first_name ?? undefined,
				lastName: user.last_name ?? undefined,
				isBlocked: user.is_blocked ?? undefined,
				blockedAt: undefined,
				unblockedAt: undefined,
				lastAccessAt: user.last_access_at,
				tempAccess: user?.temp_access
					? {
							from: user?.temp_access?.from ?? null,
							until: user?.temp_access?.until ?? null,
							status: isNil(user?.temp_access?.current?.status)
								? null
								: user?.temp_access?.current?.status === 1,
					  }
					: null,
				idps: user.idpmaps as Idp[],
			};
		}

		case UserInfoType.AvoUserProfile: {
			// Avo profile with linked user
			const profile = userInfo as Avo.User.Profile;
			return {
				profileId: profile.id,
				stamboek: profile.stamboek ?? undefined,
				organisation: profile.organisation,
				educationalOrganisations: (profile.organizations ?? []).map(
					(org): Avo.EducationOrganization.Organization => ({
						organizationId: undefined,
						unitId: undefined,
						label: org.organizationName,
					}),
				),
				subjects: profile.subjects,
				educationLevels: profile.educationLevels,
				isException: profile.is_exception ?? undefined,
				businessCategory: profile.business_category ?? undefined,
				createdAt: profile.created_at,
				userGroup: {
					name:  undefined,
					label:  undefined,
					id: profile.userGroupIds[0] ?? undefined,
				},
				userId: profile.user_id,
				uid: profile.user_id,
				email: profile?.user?.mail ?? undefined,
				fullName: profile?.user?.full_name ?? undefined,
				firstName: profile?.user?.first_name ?? undefined,
				lastName: profile?.user?.last_name ?? undefined,
				isBlocked: profile?.user?.is_blocked ?? undefined,
				blockedAt: undefined,
				unblockedAt: undefined,
				lastAccessAt: profile?.user?.last_access_at,
				tempAccess: profile?.user?.temp_access
					? {
						from: profile?.user?.temp_access?.from ?? null,
						until: profile?.user?.temp_access?.until ?? null,
						status: isNil(profile?.user?.temp_access?.current?.status)
							? null
							: profile?.user?.temp_access?.current?.status === 1,
					}
					: null,
				idps: profile?.user?.idpmaps as Idp[],
			};
		}

		case UserInfoType.UserInfoOverviewAvo: {
			// Avo user summary table info
			const user = userInfo as UserInfoOverviewAvo;
			return {
				profileId: user.profile_id,
				stamboek: user.stamboek ?? undefined,
				organisation: user.company_name
					? ({
						name: user.company_name,
					} as Avo.Organization.Organization)
					: undefined,
				educationalOrganisations: (user.organisations ?? []).map(
					(org): Avo.EducationOrganization.Organization => ({
						organizationId: org.organization_id,
						unitId: org.unit_id ?? null,
						label: org.organization?.ldap_description ?? '',
					}),
				),
				subjects: user.classifications?.map(
					(classification) => classification.key,
				),
				educationLevels: user.contexts?.map((context) => context.key),
				isException: user.is_exception ?? undefined,
				businessCategory: user.business_category ?? undefined,
				createdAt: user.acc_created_at,
				userGroup: {
					name: user.group_name ?? undefined,
					label: user.group_name ?? undefined,
					id: user.group_id ?? undefined,
				},
				userId: user.user_id,
				uid: user.user_id,
				email: user.mail ?? undefined,
				fullName: user.full_name ?? undefined,
				firstName: user.first_name ?? undefined,
				lastName: user.last_name ?? undefined,
				isBlocked: user.is_blocked ?? undefined,
				blockedAt: user?.blocked_at?.date,
				unblockedAt: user?.unblocked_at?.date,
				lastAccessAt: user.last_access_at,
				tempAccess: user?.user?.temp_access
					? {
						from: user?.user?.temp_access?.from ?? null,
						until: user?.user?.temp_access?.until ?? null,
						status: isNil(user?.user?.temp_access?.current?.status)
							? null
							: user?.user?.temp_access?.current?.status === 1,
					}
					: null,
				idps: user.idps?.map((idp) => idp.idp as unknown as Idp),
			};
		}

		case UserInfoType.UserInfoOverviewHetArchief: {
			// UserInfoOverviewHetArchief: overview user for admin-dashboard
			const profile = userInfo as UserInfoOverviewHetArchief;
			return {
				profileId: profile.id,
				email: profile.mail ?? undefined,
				firstName: profile.first_name ?? undefined,
				lastName: profile.last_name ?? undefined,
				fullName: profile.full_name ?? undefined,
				userGroup: {
					id: profile.group?.id,
					name: profile.group?.name,
					label: profile.group?.label,
				},
				idps: profile.identities?.map(
					(identity) => identity.identity_provider_name as Idp,
				),
				organisation: {
					name:
						profile.maintainer_users_profiles?.[0]?.maintainer.schema_name ??
						undefined,
					or_id:
					profile.maintainer_users_profiles?.[0]?.maintainer.schema_identifier,
					logo_url:
					profile.maintainer_users_profiles?.[0]?.maintainer?.information?.logo
						?.iri,
				},
				lastAccessAt: profile.last_access_at,
			};
		}

		case UserInfoType.HetArchiefUser: {
			// HetArchiefUser: hetArchief user info mapped by the hetarchief proxy
			const user = userInfo as HetArchiefUser;
			return {
				profileId: user.id,
				email: user.email ?? undefined,
				firstName: user.firstName ?? undefined,
				lastName: user.lastName ?? undefined,
				fullName: user.fullName ?? undefined,
				userGroup: {
					id: user.groupId,
					name: user.groupName,
					label: user.groupName,
				},
				idps: [user.idp],
				organisation: undefined,
				lastAccessAt: undefined,
			};
		}

		default:
			throw new Error(JSON.stringify({
				message: 'Failed to convert user with type',
				additionalInfo: {
					userInfoType,
				}
			}));
	}
}
