export interface IPagination<T = unknown> {
	items: T[];
	total: number;
	pages: number;
	page: number;
	size: number;
}
