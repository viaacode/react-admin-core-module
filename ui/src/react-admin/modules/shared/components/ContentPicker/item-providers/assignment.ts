import { type AvoAssignmentAssignment, AvoCoreContentPickerType } from '@viaa/avo2-types';
// TODO remove memoize in favor of react-query caching
import memoize from 'memoizee';
import { AssignmentService } from '~modules/assignment/assignment.service';
import { MEMOIZEE_OPTIONS } from '~shared/consts/memoizee-options';
import type { PickerItem } from '~shared/types/content-picker';
import { parsePickerItem } from '../helpers/parse-picker';

// fetch assignments by title-wildcard
export const retrieveAssignments = memoize(
	async (titleOrId: string | null, limit = 5): Promise<PickerItem[]> => {
		const assignments: AvoAssignmentAssignment[] | null =
			await AssignmentService.fetchAssignmentsByTitleOrId(titleOrId, limit);

		return parseAssignments(AvoCoreContentPickerType.ASSIGNMENT, assignments || []);
	},
	MEMOIZEE_OPTIONS
);

// parse raw data to react-select options
const parseAssignments = (
	type: AvoCoreContentPickerType,
	raw: AvoAssignmentAssignment[]
): PickerItem[] => {
	return raw.map(
		(item: AvoAssignmentAssignment): PickerItem => ({
			label: item.title || undefined,
			...parsePickerItem(type, item.id.toString()),
		})
	);
};
