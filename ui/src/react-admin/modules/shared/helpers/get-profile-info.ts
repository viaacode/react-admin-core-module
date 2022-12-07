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
