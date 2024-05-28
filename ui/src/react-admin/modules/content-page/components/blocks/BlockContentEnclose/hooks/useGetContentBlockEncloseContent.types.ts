import { IconNameSchema } from '@viaa/avo2-components/dist/components/Icon/Icon.types';

export interface GetContentBlockEncloseContentReturnType {
	id?: string;
	name?: string;
	description?: string;
	thumbnail?: string;
	dateCreated?: string;
	maintainerName?: string;
	icon?: IconNameSchema;
	identifier?: string;
	link?: string;
	pid?: string;
	type?: 'IE_OBJECT' | 'CONTENT_PAGE';
}

export interface IeObject {
	maintainerId: string;
	name: string;
	title: string;
	description: string;
	thumbnailUrl: string;
	dateCreatedLowerBound: string;
	maintainerName: string;
	ebucoreObjectType: string;
	meemooIdentifier: string;
	maintainerSlug: string;
	schemaIdentifier: string;
	dctermsFormat: IconNameSchema;
}

export interface ContentPage {
	id: string;
	title: string;
	description: string;
	thumbnailPath: string;
	path: string;
}
