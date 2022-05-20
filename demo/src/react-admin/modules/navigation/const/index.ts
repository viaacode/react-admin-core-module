import { createRoutePath } from '../../shared/utils';

const ROOT = 'navigatie';
const DETAIL = ':navigationName';

export const NAVIGATION_PATH = {
	NAVIGATION_OVERVIEW: createRoutePath([ROOT]),
	NAVIGATION_DETAIL: createRoutePath([ROOT, DETAIL]),
	NAVIGATION_CREATE: createRoutePath([ROOT, 'aanmaken']),
	NAVIGATION_DETAIL_CREATE: createRoutePath([ROOT, DETAIL, 'aanmaken']),
	NAVIGATION_DETAIL_EDIT: createRoutePath([ROOT, DETAIL, ':navigationElementId', 'bewerken']),
};

export const NAVIGATION_QUERY_KEYS = {
	all: ['navigation'] as const,
	lists: () => [...NAVIGATION_QUERY_KEYS.all, 'list'] as const,
	list: (placement: string) => [...NAVIGATION_QUERY_KEYS.lists(), { placement }] as const,
	details: () => [...NAVIGATION_QUERY_KEYS.all, 'detail'] as const,
	detail: (id: string) => [...NAVIGATION_QUERY_KEYS.details(), id] as const,
};
