import { UserService } from '~modules/user/user.service';
import { CustomError } from '../../../helpers/custom-error';
import { PickerItem } from '../../../types/content-picker';
import { parsePickerItem } from '../helpers/parse-picker';

import { ContentPickerType } from '~shared/components/ContentPicker/ContentPicker.types';
import { CommonUser } from '~modules/user/user.types';

// Fetch profiles from GQL
export const retrieveProfiles = async (name: string | null, limit = 5): Promise<PickerItem[]> => {
	try {
		const response: [CommonUser[], number] = await UserService.getProfiles(
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
const parseProfiles = (commonUsers: CommonUser[]): PickerItem[] => {
	return commonUsers.map(
		(user): PickerItem => ({
			label: `${user.fullName} (${user.email})`,
			...parsePickerItem(ContentPickerType.PROFILE, user.profileId),
		})
	);
};
