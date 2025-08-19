import { type Avo, type Idp, type PermissionName } from '@viaa/avo2-types';
import { type EducationOrganizationSchema } from '@viaa/avo2-types/types/education-organizations';
import { type LomSchema } from '@viaa/avo2-types/types/lom';

import { Lookup_Languages_Enum } from '../shared/generated/graphql-db-types-hetarchief';

import {
	type UserInfoCommonUserAvo,
	type UserInfoOverviewAvo,
	type UserInfoOverviewHetArchief,
	UserInfoType,
} from './users.types';

/**
 * This function should convert all user info objects to a single format
 *
 * Existing user info objects are:
 * - Avo.User.User
 * - Avo.User.Profile
 * - UserInfoOverviewAvo
 * - UserInfoOverviewHetArchief
 * - Avo.User.HetArchiefUser (already mapped to camelCase by the hetarchief proxy service)
 *
 * @param userInfo
 * @param userInfoType
 */
export function convertUserInfoToCommonUser(
	userInfo:
		| Avo.User.User
		| Avo.User.Profile
		| UserInfoOverviewAvo
		| UserInfoOverviewHetArchief
		| Avo.User.HetArchiefUser
		| Partial<UserInfoCommonUserAvo>
		| undefined,
	userInfoType: UserInfoType
): Avo.User.CommonUser | undefined {
	if (!userInfo) {
		return undefined;
	}
	switch (userInfoType) {
		case UserInfoType.AvoUserUser: {
			// Avo.User.User: Avo user object with linked profile
			const user = userInfo as Avo.User.User;
			return {
				profileId: user.profile.id,
				avatar: user?.profile?.avatar,
				stamboek: user.profile.stamboek ?? undefined,
				organisation: user.profile.organisation,
				educationalOrganisations: user.profile.organizations ?? [],
				loms: user.profile.loms,
				isException: user.profile.is_exception ?? undefined,
				businessCategory: user.profile.business_category ?? undefined,
				createdAt: user.profile.created_at,
				userGroup: {
					name: undefined,
					label: undefined,
					id: user?.profile?.userGroupIds?.[0]
						? String(user.profile.userGroupIds[0])
						: undefined,
				},
				userId: user.uid,
				uid: user.uid,
				email: user.mail ?? undefined,
				fullName:
					user.full_name ??
					(user.first_name ? [user.first_name, user.last_name].join(' ') : undefined),
				firstName: user.first_name ?? undefined,
				lastName: user.last_name ?? undefined,
				isBlocked: user.is_blocked ?? undefined,
				blockedAt: undefined,
				unblockedAt: undefined,
				lastAccessAt: user.last_access_at,
				tempAccess: user.temp_access
					? {
							from: user.temp_access.from ?? null,
							until: user.temp_access.until ?? null,
							current: user.temp_access.current,
						}
					: null,
				idps: Object.fromEntries(
					(user.idpmapObjects || []).map((idpMapObject) => [
						idpMapObject.idp as Idp,
						idpMapObject.idp_user_id as string,
					])
				),
				alias: user.profile.alias || undefined,
				title: user.profile.title || undefined,
				bio: user.profile.bio || undefined,
				alternativeEmail: user.profile.alternative_email,
				updatedAt: user.profile.updated_at || undefined,
				companyId: user.profile.company_id,
				permissions: user.profile.permissions as PermissionName[],
				language: user.profile.language,
			};
		}

		case UserInfoType.AvoUserProfile: {
			// Avo profile with linked user
			const profile = userInfo as Avo.User.Profile;
			return {
				profileId: profile.id,
				avatar: profile?.avatar,
				stamboek: profile.stamboek ?? undefined,
				organisation: profile.organisation,
				educationalOrganisations: profile.organizations ?? [],
				loms: profile.loms,
				isException: profile.is_exception ?? undefined,
				businessCategory: profile.business_category ?? undefined,
				createdAt: profile.created_at,
				userGroup: {
					name: undefined,
					label: undefined,
					id: profile.userGroupIds[0] ?? undefined,
				},
				userId: profile.user_id,
				uid: profile.user_id,
				email: profile.user.mail ?? undefined,
				fullName:
					profile.user.full_name ??
					(profile.user.first_name
						? [profile.user.first_name, profile.user.last_name].join(' ')
						: undefined),
				firstName: profile.user.first_name ?? undefined,
				lastName: profile.user.last_name ?? undefined,
				isBlocked: profile.user.is_blocked ?? undefined,
				blockedAt: undefined,
				unblockedAt: undefined,
				lastAccessAt: profile.user.last_access_at,
				tempAccess: profile.user.temp_access
					? {
							from: profile.user.temp_access.from ?? null,
							until: profile.user.temp_access.until ?? null,
							current: profile.user.temp_access.current,
						}
					: null,
				idps: Object.fromEntries(
					profile.user.idpmapObjects.map((idpMapObject) => [
						idpMapObject.idp as Idp,
						idpMapObject.idp_user_id as string,
					])
				),
				alias: profile.alias || undefined,
				title: profile.title || undefined,
				bio: profile.bio || undefined,
				alternativeEmail: profile?.alternative_email,
				updatedAt: profile.updated_at || undefined,
				companyId: profile.company_id,
				permissions: profile.permissions as PermissionName[],
				language: profile.language,
			};
		}

		case UserInfoType.UserInfoOverviewAvo: {
			// Avo user summary table info
			const user = userInfo as UserInfoOverviewAvo;
			return {
				profileId: user.profile_id,
				avatar: user?.profile?.avatar,
				stamboek: user.stamboek ?? undefined,
				organisation: user.organization?.name
					? ({
							name: user.organization.name,
							or_id: user.organization.or_id,
							logo_url: user.organization.logo_url,
						} as Avo.Organization.Organization)
					: undefined,
				educationalOrganisations: (user.educational_organizations ?? []).map(
					(org): Avo.EducationOrganization.Organization => ({
						organisationId: org.organization_id,
						organisationLabel:
							(org.organization as any)?.ldap_description ??
							(org.organization as any)?.ldap_content?.attributes?.description?.[0] ??
							(org.unit_id || 'Onbekend label'),
						unitId: org.unit_id ?? null,
						unitStreet: (org.organization as any)?.ldap_content?.units?.[0]?.attributes
							?.street?.[0],
					})
				),
				loms: (user.loms || []) as any[],
				isException: user.is_exception ?? undefined,
				businessCategory: user.business_category ?? undefined,
				createdAt: user.acc_created_at,
				updatedAt: user.acc_updated_at,
				userGroup: {
					name: user.group_name ?? undefined,
					label: user.group_name ?? undefined,
					id: user.group_id ?? undefined,
				},
				userId: user.user_id,
				uid: user.user_id,
				email: user.mail ?? undefined,
				fullName:
					user.full_name ??
					(user.first_name ? [user.first_name, user.last_name].join(' ') : undefined),
				firstName: user.first_name ?? undefined,
				lastName: user.last_name ?? undefined,
				title: user.profile?.title ?? undefined,
				alias: user.profile?.alias ?? undefined,
				alternativeEmail: user.profile?.alternative_email ?? undefined,
				bio: user.profile?.bio ?? undefined,
				isBlocked: user.is_blocked ?? undefined,
				blockedAt: user.blocked_at?.date,
				unblockedAt: user.unblocked_at?.date,
				lastAccessAt: user.last_access_at,
				language: Lookup_Languages_Enum.Nl,
				tempAccess: user.user.temp_access
					? {
							from: user.user.temp_access.from ?? null,
							until: user.user.temp_access.until ?? null,
							current: user.user.temp_access.current,
						}
					: null,
				idps: Object.fromEntries(
					user.idps.map((idpMapObject) => [
						idpMapObject.idp as unknown as Idp,
						idpMapObject.idp_user_id as string,
					])
				),
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
				fullName:
					profile.full_name ??
					(profile.first_name
						? [profile.first_name, profile.last_name].join(' ')
						: undefined),
				language: profile.language,
				userGroup: {
					id: profile.group?.id,
					name: profile.group?.name,
					label: profile.group?.label,
				},
				idps: Object.fromEntries(
					profile.identities?.map(
						(identity) => [identity.identity_provider_name as Idp, null] // User ids of idp are not fetched
					)
				),
				organisation: {
					name: profile.organisation?.skos_pref_label,
					or_id: profile.organisation?.org_identifier,
					logo_url: profile.organisation?.ha_org_has_logo,
					data: null,
				},
				loms: [],
				lastAccessAt: profile.last_access_at,
			};
		}

		case UserInfoType.HetArchiefUser: {
			// HetArchiefUser: hetArchief user info mapped by the hetarchief proxy
			const user = userInfo as Avo.User.HetArchiefUser;
			return {
				profileId: user.id,
				uid: user.id,
				userId: user.id,
				email: user.email ?? undefined,
				firstName: user.firstName ?? undefined,
				lastName: user.lastName ?? undefined,
				fullName: user.fullName ?? undefined,
				language: user.language,
				userGroup: {
					id: user.groupId,
					name: user.groupName,
					label: user.groupName,
				},
				idps: { [user.idp]: null },
				organisation: {
					or_id: user.maintainerId || user.organisationId,
					name: user.organisationName || user.visitorSpaceSlug,
					data: null,
				},
				loms: [],
				lastAccessAt: user.lastAccessAt,
				permissions: user.permissions,
				createdAt: user.createdAt,
			} as Avo.User.CommonUser;
		}

		case UserInfoType.UserInfoCommonUserAvo: {
			// UserInfoCommonUserAvo: user info coming from the common_users tables in AVO
			const user = userInfo as UserInfoCommonUserAvo;

			return {
				profileId: user.profile_id,
				uid: user.user_id,
				userId: user.user_id,
				email: user.mail ?? undefined,
				firstName: user.first_name ?? undefined,
				lastName: user.last_name ?? undefined,
				fullName:
					user.full_name ??
					(user.first_name ? [user.first_name, user.last_name].join(' ') : undefined),
				userGroup: user.user_group?.group,
				organisation: user.organisation,
				lastAccessAt: user.last_access_at,
				createdAt: user.created_at,
				avatar: user?.avatar,
				stamboek: user.stamboek ?? undefined,
				educationalOrganisations: (user.profile_educational_organizations ?? []).map(
					(item) => ({
						organisationId: item.organization_id,
						unitId: item.unit_id,
					})
				) as EducationOrganizationSchema[],
				loms: user.loms as LomSchema[],
				isException: user.is_exception ?? false,
				businessCategory: user.business_category ?? undefined,
				isBlocked: user.is_blocked ?? undefined,
				blockedAt: undefined,
				unblockedAt: undefined,
				tempAccess: user.temp_access
					? {
							from: user.temp_access.from ?? null,
							until: user.temp_access.until ?? null,
							current: user.temp_access.current,
						}
					: null,
				idps: Object.fromEntries(
					(user.idpmaps || []).map((idpMapObject) => [
						idpMapObject.idp,
						idpMapObject.idp_user_id as string,
					])
				),
				alias: user.alias || undefined,
				title: user.title || undefined,
				bio: user.bio || undefined,
				alternativeEmail: user.alternative_email,
				updatedAt: user.updated_at || undefined,
				companyId: user.company_id,
				permissions: (user.user_group?.group?.group_permissions || []).map(
					(item) => item.permission
				),
				language: user.language,
			} as Avo.User.CommonUser;
		}

		default:
			throw new Error(
				JSON.stringify({
					message: 'Failed to convert user with type',
					additionalInfo: {
						userInfoType,
					},
				})
			);
	}
}
