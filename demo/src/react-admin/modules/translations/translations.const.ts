import { ROUTE_PARTS } from '~modules/shared/consts/routes';
import { NumberParam, StringParam, withDefault } from 'use-query-params';
import { SortDirectionParam } from '~modules/shared/helpers/query-params';

export const TRANSLATIONS_PATH = {
	TRANSLATIONS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.translations}`,
	TRANSLATIONS_V2: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.translationsV2}`,
};

export interface TranslationsOverviewRef {
	onSave: () => void;
}

export const TRANSLATIONS_QUERY_PARAM_CONFIG = {
	search: withDefault(StringParam, ''),
	page: withDefault(NumberParam, 1),
	orderProp: withDefault(StringParam, 'key'),
	orderDirection: withDefault(SortDirectionParam, 'asc'),
};

export const ITEMS_PER_PAGE = 20;
