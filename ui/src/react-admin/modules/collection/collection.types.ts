import type { Avo } from '@viaa/avo2-types';

export enum ContentTypeNumber {
	audio = 1,
	video = 2,
	collection = 3,
	bundle = 4,
}

export enum ContentTypeString {
	item = 'item',
	audio = 'audio',
	video = 'video',
	collection = 'collectie',
	bundle = 'bundel',
	searchquery = 'zoekopdracht',
}

const CONTENT_TYPE_TRANSLATIONS: Record<Avo.ContentType.Dutch, Avo.ContentType.English> = {
	item: 'item',
	audio: 'audio',
	video: 'video',
	collectie: 'collection',
	opdracht: 'assignment',
	bundel: 'bundle',
	zoek: 'search',
	zoekopdracht: 'searchquery',
	contentPagina: 'contentPage',
};

export function toEnglishContentType(label: Avo.ContentType.Dutch): Avo.ContentType.English {
	return CONTENT_TYPE_TRANSLATIONS[label];
}
