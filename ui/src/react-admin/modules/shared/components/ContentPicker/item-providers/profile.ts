import { AvoCoreContentPickerType, type AvoUserCommonUser } from '@viaa/avo2-types';
import memoize from 'memoizee';
import { UserService } from '~modules/user/user.service';
import { MEMOIZEE_OPTIONS } from '~shared/consts/memoizee-options';
import { CustomError } from '~shared/helpers/custom-error';
import type { PickerItem } from '~shared/types/content-picker';
import { parsePickerItem } from '../helpers/parse-picker';

const MIN_SEARCH_LENGTH = 3;

// Fetch profiles from GQL
export const retrieveProfiles = memoize(
	async (name: string | null, limit = 5): Promise<PickerItem[]> => {
		try {
			const trimmedName = name?.trim() || null;
			if (trimmedName && trimmedName.length < MIN_SEARCH_LENGTH) {
				// Searching on 1 or 2 characters matches too many users to be useful and is slow
				return [];
			}
			const profiles = await UserService.searchProfileNames(trimmedName, limit);
			return parseProfiles(profiles);
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
const parseProfiles = (commonUsers: Partial<AvoUserCommonUser>[]): PickerItem[] => {
	return commonUsers.map(
		(user): PickerItem => ({
			label: `${user.fullName} (${user.email})`,
			...parsePickerItem(AvoCoreContentPickerType.PROFILE, user.profileId as string),
		})
	);
};
