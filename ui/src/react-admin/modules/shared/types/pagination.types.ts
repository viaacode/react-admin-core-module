// Copied from the deprecated @studiohyperdrive/pagination package
export interface IPagination<T = unknown> {
	items: T[];
	total: number;
	pages: number;
	page: number;
	size: number;
	self?: string;
	first?: string;
	last?: string;
	next?: string;
	prev?: string;
}
