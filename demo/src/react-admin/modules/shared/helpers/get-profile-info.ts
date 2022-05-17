import { get } from 'lodash-es';

import { SpecialPermissionGroups } from '../types/authentication.types';

import { CustomError } from './custom-error';

import { CommonUser } from '~modules/user/user.types';

export const getFullName = (
	profile: CommonUser | null | undefined,
	includeCompany: boolean,
	includeEmail: boolean
): string | null => {
	if (!profile) {
		return null;
	}

	const firstName = profile.firstName;
	const lastName = profile.lastName;
	const fullName = profile.fullName || `${firstName} ${lastName}`;
	const email = includeEmail ? profile.email : '';
	const organisationName = includeCompany ? profile.organisation?.name : '';

	return `${fullName}${organisationName ? ` (${organisationName})` : ''}${
		includeEmail ? ` (${email})` : ''
	}`;
};

export const getUserGroupLabel = (profile: CommonUser | null | undefined): string => {
	if (!profile) {
		console.error(
			new CustomError(
				'Failed to get profile user group label because the provided profile is undefined'
			)
		);
		return '';
	}

	return profile?.userGroup || get(profile, 'profile_user_group.group.label') || '';
};

export const getUserGroupId = (profile: CommonUser | null | undefined): number => {
	if (get(profile, 'userGroupIds[0]')) {
		return get(profile, 'userGroupIds[0]');
	}
	if (!profile) {
		console.error(
			new CustomError(
				'Failed to get profile user group id because the provided profile is undefined'
			)
		);
		return 0;
	}

	const userGroupId =
		get(profile, 'userGroupIds[0]') || get(profile, 'profile_user_group.group.id') || '';
	if (!userGroupId) {
		console.error('Failed to get user group id from profile');
	}
	return userGroupId;
};

export function getProfileName(user: CommonUser | undefined): string {
	if (!user) {
		throw new CustomError('Failed to get profile name because the logged in user is undefined');
	}
	const profileName = getFullName(user, true, false);
	if (!profileName) {
		throw new CustomError('No profile name could be found for the logged in user');
	}
	return profileName;
}

export function getUserGroupIds(user: CommonUser | null | undefined): number[] {
	return [
		...get(user, 'profile.userGroupIds', []),
		user ? SpecialPermissionGroups.loggedInUsers : SpecialPermissionGroups.loggedOutUsers,
	];
}
