import type { Avo } from '@viaa/avo2-types';
import { PermissionName } from '@viaa/avo2-types';
import { Idp } from '../shared/auth/auth.types';
import { UserInfoOverviewAvo, UserInfoOverviewHetArchief, UserInfoType } from './users.types';

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
					user.full_name ?? user.first_name
						? [user.first_name, user.last_name].join(' ')
						: undefined,
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
					user.idpmapObjects.map((idpMapObject) => [
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
					profile.user.full_name ?? profile.user.first_name
						? [profile.user.first_name, profile.user.last_name].join(' ')
						: undefined,
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
			};
		}

		case UserInfoType.UserInfoOverviewAvo: {
			// Avo user summary table info
			const user = userInfo as UserInfoOverviewAvo;
			return {
				profileId: user.profile_id,
				avatar: user?.profile?.avatar,
				stamboek: user.stamboek ?? undefined,
				organisation: user.profile?.organisation?.name
					? ({
							name: user.profile.organisation.name,
							or_id: user.profile.organisation.or_id,
							logo_url: user.profile.organisation.logo_url,
					  } as Avo.Organization.Organization)
					: undefined,
				educationalOrganisations: (user.organisations ?? []).map(
					(org): Avo.EducationOrganization.Organization => ({
						organisationId: org.organization_id,
						organisationLabel:
							(org.organization as any)?.ldap_content?.attributes?.description?.[0] ??
							'',
						unitId: org.unit_id ?? null,
						unitStreet: (org.organization as any).ldap_content?.units?.[0]?.attributes
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
					user.full_name ?? user.first_name
						? [user.first_name, user.last_name].join(' ')
						: undefined,
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
					profile.full_name ?? profile.first_name
						? [profile.first_name, profile.last_name].join(' ')
						: undefined,
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
					name: profile.organisation?.schema_name,
					or_id: profile.organisation?.schema_identifier,
					logo_url: profile.organisation?.logo,
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
				userGroup: {
					id: user.groupId,
					name: user.groupName,
					label: user.groupName,
				},
				idps: { [user.idp]: null },
				organisation: {
					or_id: user.maintainerId || user.organisationId,
					name: user.visitorSpaceSlug || user.organisationName,
					data: null,
				},
				loms: [],
				lastAccessAt: undefined,
				permissions: user.permissions,
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
