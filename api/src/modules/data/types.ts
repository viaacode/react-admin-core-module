// biome-ignore lint/suspicious/noExplicitAny: any query response object
export interface GraphQlResponse<T = any> {
	data?: T;
	// biome-ignore lint/suspicious/noExplicitAny: error can be any type
	errors?: any;
}
