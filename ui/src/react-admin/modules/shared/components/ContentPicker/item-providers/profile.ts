import {
	AvoCoreContentPickerType,
	AvoSearchOrderDirection,
	type AvoUserCommonUser,
} from '@viaa/avo2-types';
import memoize from 'memoizee';
import { UserService } from '~modules/user/user.service';
import { MEMOIZEE_OPTIONS } from '~shared/consts/memoizee-options';
import { CustomError } from '~shared/helpers/custom-error';
import type { PickerItem } from '~shared/types/content-picker';
import { parsePickerItem } from '../helpers/parse-picker';

// Fetch profiles from GQL
export const retrieveProfiles = memoize(
	async (name: string | null, limit = 5): Promise<PickerItem[]> => {
		try {
			const response: [AvoUserCommonUser[], number] = await UserService.getProfiles(
				0,
				limit,
				'lastAccessAt',
				AvoSearchOrderDirection.DESC,
				'dateTime',
				name
					? {
							_or: [{ full_name: { _ilike: `%${name}%` } }, { mail: { _ilike: `%${name}%` } }],
						}
					: undefined
			);
			return parseProfiles(response[0]);
		} catch (err) {
			throw new CustomError('Failed to get profiles for content picker', err, {
				name,
				limit,
			});
		}
	},
	MEMOIZEE_OPTIONS
);

// Convert profiles to react-select options
const parseProfiles = (commonUsers: AvoUserCommonUser[]): PickerItem[] => {
	return commonUsers.map(
		(user): PickerItem => ({
			label: `${user.fullName} (${user.email})`,
			...parsePickerItem(AvoCoreContentPickerType.PROFILE, user.profileId),
		})
	);
};
