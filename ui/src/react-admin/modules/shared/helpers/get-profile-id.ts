import type { Avo } from '@viaa/avo2-types';

import { CustomError } from './custom-error.js';

export function getProfileId(user: Avo.User.CommonUser | undefined): string {
	if (!user) {
		throw new CustomError('Failed to get profile id because the logged in user is undefined');
	}
	const profileId = user?.profileId;
	if (!profileId) {
		throw new CustomError('No profile id could be found for the logged in user');
	}
	return profileId;
}
