import type { ObjectType } from '~shared/helpers/mapFormatToType.ts';

export interface Theme {
	id: string;
	slug: string;
	nameNl: string;
	nameEn: string;
	imageUrl: string;
	contentPagePathEn: string | null;
	contentPagePathNl: string | null;
	descriptionEn: string | null;
	descriptionNl: string | null;
}

export interface ThemeWithObjects extends Theme {
	ieObjects: {
		id: string;
		schemaIdentifier: string;
		name: string;
		format: ObjectType;
		thumbnailUrl: string;
		maintainerId: string;
		maintainerName: string;
	}[];
}

export interface ThemesResponse {
	items: Theme[];
	total: number;
	pages: number;
	page: number;
	size: number;
}
