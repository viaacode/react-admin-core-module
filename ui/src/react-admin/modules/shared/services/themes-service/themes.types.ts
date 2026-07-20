export interface Theme {
	id: string;
	slug: string;
	nameNl: string;
	nameEn: string;
	imageUrl: string | null;
}

export interface ThemesResponse {
	items: Theme[];
	total: number;
	pages: number;
	page: number;
	size: number;
}
