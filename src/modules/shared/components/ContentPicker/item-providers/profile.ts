import { Avo } from '@viaa/avo2-types';

import { UserService } from '../../../../user/user.service';
import { CustomError } from '../../../helpers/custom-error';
import { PickerSelectItem } from '../../../types/content-picker';
import { parsePickerItem } from '../helpers/parse-picker';

import { ContentPickerType } from '~modules/shared/components/ContentPicker/ContentPicker.types';

// Fetch profiles from GQL
export const retrieveProfiles = async (
	name: string | null,
	limit = 5
): Promise<PickerSelectItem[]> => {
	try {
		const response: [Avo.User.Profile[], number] = await UserService.getProfiles(
			0,
			'last_access_at',
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
const parseProfiles = (profiles: Avo.User.Profile[]): PickerSelectItem[] => {
	return profiles.map(
		(profile): PickerSelectItem => ({
			label: `${profile.user.full_name} (${profile.user.mail})`,
			value: parsePickerItem(ContentPickerType.PROFILE, profile.id),
		})
	);
};
