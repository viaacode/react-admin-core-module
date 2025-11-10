import { Avo } from '@viaa/avo2-types';

export function toggleSortOrder(
	oldSortOrder: string | null | undefined
): Avo.Search.OrderDirection {
	return oldSortOrder === Avo.Search.OrderDirection.ASC
		? Avo.Search.OrderDirection.DESC
		: Avo.Search.OrderDirection.ASC;
}
