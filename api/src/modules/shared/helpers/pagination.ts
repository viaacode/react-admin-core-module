import type { IPagination } from '../types/pagination';

/**
 * Wrap a page of items with paging info
 * Replaces the deprecated @studiohyperdrive/pagination package, minus the unused link generation (path/query)
 */
export function Pagination<T = unknown>({
	items,
	page,
	size,
	total,
}: {
	items: T[];
	page: number;
	size: number;
	total: number;
}): IPagination<T> {
	return {
		items,
		total,
		pages: Math.ceil(total / size),
		page,
		size,
	};
}
