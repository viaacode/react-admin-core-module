import { Avo } from '@viaa/avo2-types';
import { get } from 'lodash-es';

import { SpecialPermissionGroups } from '../types/authentication.types';

import { CustomError } from './custom-error';
import { getFullName, getProfile } from './formatters/avatar';

import { CommonUser } from '~modules/user/user.types';

export const getUserGroupLabel = (
	userOrProfile: Avo.User.Profile | { profile: Avo.User.Profile } | null | undefined
): string => {
	if (!userOrProfile) {
		console.error(
			new CustomError(
				'Failed to get profile user group label because the provided profile is undefined'
			)
		);
		return '';
	}

	const profile = getProfile(userOrProfile);
	return get(userOrProfile, 'group_name') || get(profile, 'profile_user_group.group.label') || '';
};

export const getUserGroupId = (
	userOrProfile: Avo.User.Profile | { profile: Avo.User.Profile } | null | undefined
): number => {
	if (get(userOrProfile, 'userGroupIds[0]')) {
		return get(userOrProfile, 'userGroupIds[0]');
	}
	if (!userOrProfile) {
		console.error(
			new CustomError(
				'Failed to get profile user group id because the provided profile is undefined'
			)
		);
		return 0;
	}

	const profile = getProfile(userOrProfile);
	const userGroupId =
		get(profile, 'userGroupIds[0]') || get(profile, 'profile_user_group.group.id') || '';
	if (!userGroupId) {
		console.error('Failed to get user group id from profile');
	}
	return userGroupId;
};

export function getProfileName(user: Avo.User.User | undefined): string {
	if (!user) {
		throw new CustomError('Failed to get profile name because the logged in user is undefined');
	}
	const profileName = getFullName(user as any, true, false);
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
