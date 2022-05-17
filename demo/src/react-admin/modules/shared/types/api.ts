export interface ApiResponseWrapper<T> {
	items: T[];
	total: number;
	pages: number;
	page: number;
	size: number;
}
