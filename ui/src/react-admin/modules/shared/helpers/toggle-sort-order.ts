import { OrderDirection } from '~shared/types';

export function toggleSortOrder(oldSortOrder: string | null | undefined): OrderDirection {
	return oldSortOrder === OrderDirection.asc ? OrderDirection.desc : OrderDirection.asc;
}
