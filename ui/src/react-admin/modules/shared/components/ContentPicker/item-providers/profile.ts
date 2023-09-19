import { UserService } from '~modules/user/user.service';
import { CustomError } from '~shared/helpers/custom-error';
import { PickerItem } from '~shared/types/content-picker';
import { parsePickerItem } from '../helpers/parse-picker';

import type { Avo } from '@viaa/avo2-types';

// Fetch profiles from GQL
export const retrieveProfiles = async (name: string | null, limit = 5): Promise<PickerItem[]> => {
	try {
		const response: [Avo.User.CommonUser[], number] = await UserService.getProfiles(
			0,
			'lastAccessAt',
			'desc',
			'dateTime',
			name
				? {
						_or: [
							{ full_name: { _ilike: `%${name}%` } },
							{ mail: { _ilike: `%${name}%` } },
						],
				  }
				: undefined,
			limit
		);
		return parseProfiles(response[0]);
	} catch (err) {
		throw new CustomError('Failed to get profiles for content picker', err, {
			name,
			limit,
		});
	}
};

// Convert profiles to react-select options
const parseProfiles = (commonUsers: Avo.User.CommonUser[]): PickerItem[] => {
	return commonUsers.map(
		(user): PickerItem => ({
			label: `${user.fullName} (${user.email})`,
			...parsePickerItem('PROFILE', user.profileId),
		})
	);
};
