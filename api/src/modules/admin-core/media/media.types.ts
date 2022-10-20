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

export enum MediaFormat {
	VIDEO = 'video',
	AUDIO = 'audio',
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
	creator: any;
	actor?: any;
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

export enum SearchFilterField {
	QUERY = 'query',
	ADVANCED_QUERY = 'advancedQuery',
	FORMAT = 'format',
	DURATION = 'duration',
	CREATED = 'created',
	PUBLISHED = 'published',
	CREATOR = 'creator',
	GENRE = 'genre',
	KEYWORD = 'keyword',
	NAME = 'name',
	PUBLISHER = 'publisher',
	DESCRIPTION = 'description',
	ERA = 'era',
	LOCATION = 'location',
	LANGUAGE = 'language',
	MEDIUM = 'medium',
}

export enum Operator {
	CONTAINS = 'contains',
	CONTAINS_NOT = 'containsNot',
	IS = 'is',
	IS_NOT = 'isNot',
	GTE = 'gte',
	LTE = 'lte',
}

export enum OrderProperty {
	RELEVANCE = 'relevance',
	CREATED = 'created',
	PUBLISHED = 'published',
	NAME = 'name',
}

export enum License {
	BEZOEKERTOOL_CONTENT = 'BEZOEKERTOOL-CONTENT',
	BEZOEKERTOOL_METADATA_ALL = 'BEZOEKERTOOL-METADATA-ALL',
}

export interface MediaSearchAggregation<T> {
	buckets: {
		key: T;
		doc_count: number;
	}[];
	doc_count_error_upper_bound: number;
	sum_other_doc_count: number;
}

export interface ElasticsearchResponse {
	took: number;
	timed_out: boolean;
	_shards: {
		total: number;
		successful: number;
		skipped: number;
		failed: number;
	};
	hits: {
		total: {
			value: number;
			relation: string;
		};
		max_score: number;
		hits: ElasticsearchHit[];
	};
	aggregations: {
		dcterms_format: MediaSearchAggregation<string>;
		dcterms_medium: MediaSearchAggregation<string>;
		schema_genre: MediaSearchAggregation<string>;
		schema_creator: MediaSearchAggregation<string>;
		schema_in_language: MediaSearchAggregation<string>;
	};
}

export interface ElasticsearchHit {
	_index: string;
	_type: string;
	_id: string;
	_score: number;
	_source: ElasticsearchMedia;
}

export interface ElasticsearchMedia {
	ebucore_object_type: any;
	schema_in_language: string[];
	dcterms_available: string;
	meemoo_identifier: string;
	schema_creator?: {
		Maker?: string[];
		Archiefvormer?: string[];
	};
	schema_identifier: string;
	schema_description?: string;
	schema_publisher: any;
	schema_duration: string;
	dcterms_medium?: string | null;
	premis_is_part_of?: string;
	schema_abstract: any;
	premis_identifier?: {
		Afbeelding?: string[];
		Objectnaam?: string[];
		object_nummer?: string[];
		kp_productie_id?: string[];
		kp_show_id?: string[];
		Inventarisnummer?: string[];
		batch?: string[];
		Acquisition_number?: string[];
		Bestandsnaam?: string[];
		Api?: string[];
		Object_number?: string[];
		MEDIA_ID?: string[];
	};
	schema_keywords: string[];
	schema_is_part_of?: {
		archief?: string[];
		reeks?: string[];
		alternatief?: string[];
		serie?: string[];
	};
	schema_genre: string[];
	schema_date_published?: string;
	schema_license: string[];
	schema_date_created?: string;
	schema_contributor?: {
		Voorzitter: string[];
	};
	schema_maintainer: {
		schema_identifier: string;
		schema_name: string;
	}[];
	schema_thumbnail_url: string;
	dcterms_format: string;
	schema_name: string;
}
