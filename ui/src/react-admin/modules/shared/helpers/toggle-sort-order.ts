import { AvoSearchOrderDirection } from '@viaa/avo2-types';

export function toggleSortOrder(oldSortOrder: string | null | undefined): AvoSearchOrderDirection {
	return oldSortOrder === AvoSearchOrderDirection.ASC
		? AvoSearchOrderDirection.DESC
		: AvoSearchOrderDirection.ASC;
}
