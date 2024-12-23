import type { Avo } from '@viaa/avo2-types';

import { parsePickerItem } from '../helpers/parse-picker';

import { AssignmentService } from '~modules/assignment/assignment.service';
import type { PickerItem } from '~shared/types/content-picker';
import memoize from 'memoizee';
import { MEMOIZEE_OPTIONS } from '~shared/consts/memoizee-options';

// fetch assignments by title-wildcard
export const retrieveAssignments = memoize(
	async (titleOrId: string | null, limit = 5): Promise<PickerItem[]> => {
		const assignments: Avo.Assignment.Assignment[] | null =
			await AssignmentService.fetchAssignmentsByTitleOrId(titleOrId, limit);

		return parseAssignments('ASSIGNMENT', assignments || []);
	},
	MEMOIZEE_OPTIONS
);

// parse raw data to react-select options
const parseAssignments = (
	type: Avo.Core.ContentPickerType,
	raw: Avo.Assignment.Assignment[]
): PickerItem[] => {
	return raw.map(
		(item: Avo.Assignment.Assignment): PickerItem => ({
			label: item.title || undefined,
			...parsePickerItem(type, item.id.toString()),
		})
	);
};
