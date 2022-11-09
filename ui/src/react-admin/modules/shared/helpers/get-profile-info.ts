import { CustomError } from './custom-error';

import { CommonUser } from '~modules/user/user.types';

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
	const fullName = profile.fullName|| `${firstName} ${lastName}`;
	const email = includeEmail ? profile.email : '';
	const organisationName = includeCompany ? profile.organisation?.name : '';

	return `${fullName}${organisationName ? ` (${organisationName})` : ''}${
		includeEmail ? ` (${email})` : ''
	}`;
};
