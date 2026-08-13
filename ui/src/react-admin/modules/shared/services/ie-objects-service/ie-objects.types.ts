import type { ObjectType } from '~shared/helpers/mapFormatToType.ts';

// Subset of the entire IeObject
export interface IeObject {
	dctermsFormat: ObjectType;
	schemaIdentifier: string; // Unique id per object
	maintainerId: string;
	maintainerName: string;
	maintainerSlug: string;
	maintainerLogo: string | null;
	name: string;
	thumbnailUrl: string;
	width?: string;
	height?: string;
}
