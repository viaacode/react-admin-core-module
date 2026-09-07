import type { HetArchiefIeObjectType } from '@viaa/avo2-types';

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
		format: HetArchiefIeObjectType;
		// Null when the object has no thumbnail, or when the current user may not see its essence
		thumbnailUrl: string | null;
		/**
		 * Whether the current user may see/play this object's essence. Computed by the proxy from the
		 * licenses the user can access. Use this instead of checking thumbnailUrl for truthiness.
		 */
		hasAccessToEssence: boolean;
		maintainerId: string;
		maintainerName: string;
	}[];
	// The number of ie-objects linked to the theme, which is more than the objects in `ieObjects`
	// since those are capped by the requested page size.
	total: number;
}

export interface ThemesResponse {
	items: Theme[];
	total: number;
	pages: number;
	page: number;
	size: number;
}
