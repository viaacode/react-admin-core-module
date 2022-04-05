import { get } from 'lodash-es';

import { CustomError } from './custom-error';

import { User } from '~modules/user/user.types';

export function getProfileId(user: User | undefined): string {
	if (!user) {
		throw new CustomError('Failed to get profile id because the logged in user is undefined');
	}
	const profileId = get(user, 'profile.id');
	if (!profileId) {
		throw new CustomError('No profile id could be found for the logged in user');
	}
	return profileId;
}
