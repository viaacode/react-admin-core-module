import { createRoutePath } from '../../shared/utils';

const ROOT = 'vertalingen';

export const TRANSLATIONS_PATHS = {
	overview: createRoutePath([ROOT]),
};

export const TRANSLATIONS_QUERY_KEYS = {
	all: ['translations'] as const,
};
