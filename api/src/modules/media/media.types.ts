export interface Address {
	street: string;
	postalCode: string;
	locality: string;
	postOfficeBoxNumber: string;
}

export interface ContactInfo {
	email?: string | null;
	telephone?: string | null;
	address: Address;
}

export interface MediaFile {
	name: string;
	alternateName: string;
	description: string;
	schemaIdentifier: string;
	ebucoreMediaType: string;
	ebucoreIsMediaFragmentOf: string;
	embedUrl: string;
}

export interface Representation {
	name: string;
	alternateName: string;
	description: string;
	schemaIdentifier: string;
	dctermsFormat: string;
	transcript: string;
	dateCreated: string;
	files: MediaFile[];
}

export interface Media {
	schemaIdentifier: string; // Unique id per object
	meemooIdentifier: string; // PID (not unique per object)
	// biome-ignore lint/suspicious/noExplicitAny: todo
	premisIdentifier: any;
	premisIsPartOf?: string;
	series?: string[];
	program?: string[];
	alternativeName?: string[];
	maintainerId: string;
	maintainerName: string;
	contactInfo?: ContactInfo;
	copyrightHolder?: string;
	copyrightNotice?: string;
	durationInSeconds?: number;
	numberOfPages?: number;
	datePublished: string;
	dctermsAvailable: string;
	name: string;
	description: string;
	abstract: string;
	// biome-ignore lint/suspicious/noExplicitAny: todo
	creator: any;
	// biome-ignore lint/suspicious/noExplicitAny: todo
	actor?: any;
	// biome-ignore lint/suspicious/noExplicitAny: todo
	publisher: any;
	spatial: string;
	temporal: string;
	keywords: string[];
	genre: string[];
	dctermsFormat: string;
	dctermsMedium: string;
	inLanguage: string[];
	thumbnailUrl: string;
	// embedUrl: string;
	duration: string;
	// biome-ignore lint/suspicious/noExplicitAny: todo
	license: any;
	meemooMediaObjectId?: string;
	dateCreated: string;
	dateCreatedLowerBound?: string;
	ebucoreObjectType: string;
	meemoofilmColor: boolean;
	meemoofilmBase: string;
	meemoofilmImageOrSound: string;
	meemooLocalId: string;
	meemooOriginalCp: string;
	meemooDescriptionProgramme: string;
	meemooDescriptionCast: string;
	representations?: Representation[];
}
