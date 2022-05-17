import { Avo } from '@viaa/avo2-types';

import { UserService } from '~modules/user/user.service';
import { CustomError } from '../../../helpers/custom-error';
import { PickerItem } from '../../../types/content-picker';
import { parsePickerItem } from '../helpers/parse-picker';

import { ContentPickerType } from '~modules/shared/components/ContentPicker/ContentPicker.types';

// Fetch profiles from GQL
export const retrieveProfiles = async (name: string | null, limit = 5): Promise<PickerItem[]> => {
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
const parseProfiles = (profiles: any[]): PickerItem[] => {
	return profiles.map((profile): PickerItem => {
		const fullName = profile?.user?.full_name || profile?.fullName;
		const mail = profile?.user?.mail || profile?.email;
		return {
			label: `${fullName} (${mail})`,
			...parsePickerItem(ContentPickerType.PROFILE, profile.id),
		};
	});
};
