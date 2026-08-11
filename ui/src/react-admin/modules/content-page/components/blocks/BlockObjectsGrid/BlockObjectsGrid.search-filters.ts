import { format, parseISO } from 'date-fns';

/**
 * ie-objects search-API filter model + hetarchief `/zoeken` URL → filter translation.
 *
 * This is a faithful, UI-free PORT of the hetarchief-client logic (it cannot be imported: the
 * client depends on `@meemoo/admin-core-ui`, not the other way around). Kept in sync with:
 *   - hetarchief-client `shared/types/ie-objects.ts`            (IeObjectsSearchFilterField / …Operator)
 *   - hetarchief-client `visitor-space/utils/elastic-filters`   (mapFiltersToElastic)
 *   - hetarchief-client `visitor-space/utils/map-filters`       (mapAdvancedToElastic)
 *   - hetarchief-client `visitor-space/const/advanced-filters.consts` (FILTERS_OPTIONS_CONFIG)
 *   - hetarchief-client `visitor-space/const/advanced-filter-array-param` (url codec)
 */

// Mirrors IeObjectsSearchFilterField.
export enum IeObjectsSearchFilterField {
	RELEASE_DATE = 'releaseDate',
	CREATED = 'created',
	CREATOR = 'creator',
	DESCRIPTION = 'description',
	DURATION = 'duration',
	SPACIAL_COVERAGE = 'spacialCoverage',
	TEMPORAL_COVERAGE = 'temporalCoverage',
	FORMAT = 'format',
	GENRE = 'genre',
	KEYWORD = 'keyword',
	LANGUAGE = 'language',
	MEDIUM = 'medium',
	NAME = 'name',
	PUBLISHED = 'published',
	PUBLISHER = 'publisher',
	NEWSPAPER_SERIES_NAME = 'newspaperSeriesName',
	LOCATION_CREATED = 'locationCreated',
	MENTIONS = 'mentions',
	QUERY = 'query',
	MAINTAINER_ID = 'maintainer',
	CONSULTABLE_ONLY_ON_LOCATION = 'isConsultableOnlyOnLocation',
	CONSULTABLE_MEDIA = 'isConsultableMedia',
	CONSULTABLE_PUBLIC_DOMAIN = 'isConsultablePublicDomain',
	REUSABILITY = 'reusability',
	RIGHTS = 'rights',
	CAST = 'cast',
	IDENTIFIER = 'identifier',
	OBJECT_TYPE = 'objectType',
}

// Mirrors IeObjectsSearchOperator.
export enum IeObjectsSearchOperator {
	CONTAINS = 'contains',
	CONTAINS_NOT = 'containsNot',
	GTE = 'gte',
	IS = 'is',
	IS_NOT = 'isNot',
	LTE = 'lte',
}

export interface SearchFilter {
	field: IeObjectsSearchFilterField;
	operator: IeObjectsSearchOperator;
	value?: string;
	multiValue?: string[];
}

// The client joins multi-value ranges with SEPARATOR and label-suffixes values with this delimiter.
const SEPARATOR = '--';
export const FILTER_LABEL_VALUE_DELIMITER = '---';

// --- Advanced filter model (mirrors FilterProperty / Operator) --------------------------------

enum FilterProperty {
	CAST = 'CAST',
	CREATED_AT = 'CREATED_AT',
	CREATOR = 'CREATOR',
	DESCRIPTION = 'DESCRIPTION',
	DURATION = 'DURATION',
	GENRE = 'GENRE',
	IDENTIFIER = 'IDENTIFIER',
	KEYWORDS = 'KEYWORDS',
	LANGUAGE = 'LANGUAGE',
	MEDIA_TYPE = 'MEDIA_TYPE',
	MEDIUM = 'MEDIUM',
	OBJECT_TYPE = 'OBJECT_TYPE',
	PUBLISHED_AT = 'PUBLISHED_AT',
	PUBLISHER = 'PUBLISHER',
	RELEASE_DATE = 'RELEASE_DATE',
	RIGHTS = 'RIGHTS',
	SPACIAL_COVERAGE = 'SPACIAL_COVERAGE',
	TEMPORAL_COVERAGE = 'TEMPORAL_COVERAGE',
	TITLE = 'TITLE',
	NEWSPAPER_SERIES_NAME = 'NEWSPAPER_SERIES_NAME',
	LOCATION_CREATED = 'LOCATION_CREATED',
	MENTIONS = 'MENTIONS',
}

enum Operator {
	CONTAINS = 'CONTAINS',
	CONTAINS_NOT = 'CONTAINS_NOT',
	EQUALS = 'EQUALS',
	EQUALS_NOT = 'EQUALS_NOT',
	LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL',
	GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
	BETWEEN = 'BETWEEN',
	EXACT = 'EXACT',
}

interface AdvancedFilter {
	prop: FilterProperty;
	op: Operator;
	val?: string;
}

// 2-letter url acronyms (mirrors advanced-filter-array-param).
const FILTER_NAME_WITH_ACRONYM: [FilterProperty, string][] = [
	[FilterProperty.CAST, 'cs'],
	[FilterProperty.CREATED_AT, 'ca'],
	[FilterProperty.CREATOR, 'ct'],
	[FilterProperty.DESCRIPTION, 'de'],
	[FilterProperty.DURATION, 'du'],
	[FilterProperty.GENRE, 'ge'],
	[FilterProperty.IDENTIFIER, 'id'],
	[FilterProperty.KEYWORDS, 'kw'],
	[FilterProperty.LANGUAGE, 'la'],
	[FilterProperty.MEDIA_TYPE, 'ty'],
	[FilterProperty.MEDIUM, 'me'],
	[FilterProperty.OBJECT_TYPE, 'ot'],
	[FilterProperty.PUBLISHED_AT, 'pa'],
	[FilterProperty.PUBLISHER, 'pu'],
	[FilterProperty.RELEASE_DATE, 'rd'],
	[FilterProperty.RIGHTS, 'ri'],
	[FilterProperty.SPACIAL_COVERAGE, 'sc'],
	[FilterProperty.TEMPORAL_COVERAGE, 'tc'],
	[FilterProperty.TITLE, 'ti'],
	[FilterProperty.NEWSPAPER_SERIES_NAME, 'ns'],
	[FilterProperty.LOCATION_CREATED, 'lc'],
	[FilterProperty.MENTIONS, 'mn'],
];

const FILTER_OPERATOR_WITH_ACRONYM: [Operator, string][] = [
	[Operator.CONTAINS, 'co'],
	[Operator.CONTAINS_NOT, 'nc'],
	[Operator.EQUALS, 'eq'],
	[Operator.EQUALS_NOT, 'ne'],
	[Operator.LESS_THAN_OR_EQUAL, 'lt'],
	[Operator.GREATER_THAN_OR_EQUAL, 'gt'],
	[Operator.BETWEEN, 'bt'],
	[Operator.EXACT, 'ex'],
];

const acronymToFilterProperty = (acronym: string): FilterProperty | undefined =>
	FILTER_NAME_WITH_ACRONYM.find(([, acr]) => acr === acronym)?.[0];

const acronymToOperator = (acronym: string): Operator | undefined =>
	FILTER_OPERATOR_WITH_ACRONYM.find(([, acr]) => acr === acronym)?.[0];

/**
 * Decode a single `advanced`/`duration`/`releaseDate` url param value into advanced filters.
 * Mirrors AdvancedFilterArrayParam.decode (renderKey/uuid omitted — not needed server-side).
 */
const decodeAdvancedFilterParam = (stringified: string | null): AdvancedFilter[] => {
	if (!stringified) {
		return [];
	}
	return stringified
		.split(',')
		.map((filter): AdvancedFilter | null => {
			const prop = acronymToFilterProperty(filter.slice(0, 2));
			const op = acronymToOperator(filter.slice(2, 4));
			if (!prop || !op) {
				return null;
			}
			return { prop, op, val: decodeURIComponent(filter.slice(4)) };
		})
		.filter((filter): filter is AdvancedFilter => filter !== null);
};

// Data-only port of FILTERS_OPTIONS_CONFIG: (property, operator) → filter template(s).
const dateFilters = (field: IeObjectsSearchFilterField) => ({
	[Operator.GREATER_THAN_OR_EQUAL]: [{ field, operator: IeObjectsSearchOperator.GTE }],
	[Operator.LESS_THAN_OR_EQUAL]: [{ field, operator: IeObjectsSearchOperator.LTE }],
	[Operator.BETWEEN]: [
		{ field, operator: IeObjectsSearchOperator.GTE },
		{ field, operator: IeObjectsSearchOperator.LTE },
	],
	[Operator.EQUALS]: [
		{ field, operator: IeObjectsSearchOperator.GTE },
		{ field, operator: IeObjectsSearchOperator.LTE },
	],
});

const containsAndEqualsFilters = (field: IeObjectsSearchFilterField) => ({
	[Operator.CONTAINS]: [{ field, operator: IeObjectsSearchOperator.CONTAINS }],
	[Operator.CONTAINS_NOT]: [{ field, operator: IeObjectsSearchOperator.CONTAINS_NOT }],
	[Operator.EQUALS]: [{ field, operator: IeObjectsSearchOperator.IS }],
	[Operator.EQUALS_NOT]: [{ field, operator: IeObjectsSearchOperator.IS_NOT }],
});

const equalsFilters = (field: IeObjectsSearchFilterField) => ({
	[Operator.EQUALS]: [{ field, operator: IeObjectsSearchOperator.IS }],
	[Operator.EQUALS_NOT]: [{ field, operator: IeObjectsSearchOperator.IS_NOT }],
});

const containsFilters = (field: IeObjectsSearchFilterField) => ({
	[Operator.CONTAINS]: [{ field, operator: IeObjectsSearchOperator.CONTAINS }],
	[Operator.CONTAINS_NOT]: [{ field, operator: IeObjectsSearchOperator.CONTAINS_NOT }],
});

const FILTERS_OPTIONS_CONFIG: Partial<
	Record<FilterProperty, Partial<Record<Operator, SearchFilter[]>>>
> = {
	[FilterProperty.RELEASE_DATE]: dateFilters(IeObjectsSearchFilterField.RELEASE_DATE),
	[FilterProperty.CREATED_AT]: dateFilters(IeObjectsSearchFilterField.CREATED),
	[FilterProperty.PUBLISHED_AT]: dateFilters(IeObjectsSearchFilterField.PUBLISHED),
	[FilterProperty.DURATION]: {
		[Operator.GREATER_THAN_OR_EQUAL]: [
			{ field: IeObjectsSearchFilterField.DURATION, operator: IeObjectsSearchOperator.GTE },
		],
		[Operator.LESS_THAN_OR_EQUAL]: [
			{ field: IeObjectsSearchFilterField.DURATION, operator: IeObjectsSearchOperator.LTE },
		],
	},
	[FilterProperty.DESCRIPTION]: containsFilters(IeObjectsSearchFilterField.DESCRIPTION),
	[FilterProperty.GENRE]: equalsFilters(IeObjectsSearchFilterField.GENRE),
	[FilterProperty.LANGUAGE]: equalsFilters(IeObjectsSearchFilterField.LANGUAGE),
	[FilterProperty.RIGHTS]: equalsFilters(IeObjectsSearchFilterField.RIGHTS),
	[FilterProperty.MEDIUM]: equalsFilters(IeObjectsSearchFilterField.MEDIUM),
	[FilterProperty.SPACIAL_COVERAGE]: containsAndEqualsFilters(
		IeObjectsSearchFilterField.SPACIAL_COVERAGE
	),
	[FilterProperty.TEMPORAL_COVERAGE]: containsAndEqualsFilters(
		IeObjectsSearchFilterField.TEMPORAL_COVERAGE
	),
	[FilterProperty.OBJECT_TYPE]: containsAndEqualsFilters(IeObjectsSearchFilterField.OBJECT_TYPE),
	[FilterProperty.PUBLISHER]: containsAndEqualsFilters(IeObjectsSearchFilterField.PUBLISHER),
	[FilterProperty.TITLE]: containsAndEqualsFilters(IeObjectsSearchFilterField.NAME),
	[FilterProperty.CAST]: containsAndEqualsFilters(IeObjectsSearchFilterField.CAST),
	[FilterProperty.IDENTIFIER]: equalsFilters(IeObjectsSearchFilterField.IDENTIFIER),
	[FilterProperty.KEYWORDS]: containsAndEqualsFilters(IeObjectsSearchFilterField.KEYWORD),
	[FilterProperty.CREATOR]: containsAndEqualsFilters(IeObjectsSearchFilterField.CREATOR),
	[FilterProperty.LOCATION_CREATED]: containsAndEqualsFilters(
		IeObjectsSearchFilterField.LOCATION_CREATED
	),
	[FilterProperty.NEWSPAPER_SERIES_NAME]: containsAndEqualsFilters(
		IeObjectsSearchFilterField.NEWSPAPER_SERIES_NAME
	),
	[FilterProperty.MENTIONS]: containsAndEqualsFilters(IeObjectsSearchFilterField.MENTIONS),
};

const getMetadataSearchFilters = (prop: FilterProperty, operator: Operator): SearchFilter[] =>
	FILTERS_OPTIONS_CONFIG[prop]?.[operator] || [];

/** Faithful port of mapAdvancedToElastic: turns one advanced filter into ES filter(s). */
const mapAdvancedToElastic = (item: AdvancedFilter): SearchFilter[] => {
	const values = (item.val || '').split(SEPARATOR);
	const filters = item.prop && item.op ? getMetadataSearchFilters(item.prop, item.op) : [];

	return filters.map((filter, i): SearchFilter => {
		switch (item.prop) {
			case FilterProperty.CREATED_AT:
			case FilterProperty.PUBLISHED_AT:
			case FilterProperty.RELEASE_DATE: {
				if (item.op === Operator.EQUALS && values.length === 1) {
					// Manually create a range of equal values: ARC-3191
					values[i] = values[0];
				}
				const parsed = parseISO(values[i]);
				values[i] = (parsed && format(parsed, 'yyyy-MM-dd')) || values[i];
				break;
			}
			case FilterProperty.DURATION:
				// Add milliseconds since elasticsearch requires it: ARC-2549
				values[i] = `${values[0]}.00`;
				break;
			default:
				break;
		}
		return { ...filter, value: values[i] };
	});
};

/**
 * Convert one hetarchief `/zoeken` url param value (comma-separated, acronym-encoded advanced
 * filters — used by `advanced`, `duration`, `releaseDate`) into ES search filters.
 */
export const mapAdvancedFilterParamToElastic = (paramValue: string | null): SearchFilter[] =>
	decodeAdvancedFilterParam(paramValue).flatMap(mapAdvancedToElastic);
