import type { Avo } from '@viaa/avo2-types';

export enum GraphQlSortDirections {
	asc_nulls_last = 'asc_nulls_last',
	asc_nulls_first = 'asc_nulls_first',
	desc_nulls_first = 'desc_nulls_first',
	desc_nulls_last = 'desc_nulls_last',
	asc = 'asc',
	desc = 'desc',
}

const DEFAULT_NULL_ORDER: Record<Avo.Search.OrderDirection, GraphQlSortDirections> = {
	asc: GraphQlSortDirections.asc_nulls_last,
	desc: GraphQlSortDirections.desc_nulls_first,
};

// Reverse order so asc sorts [true false null], and desc sorts [null false true]
const BOOLEAN_ORDER: Record<Avo.Search.OrderDirection, GraphQlSortDirections> = {
	asc: GraphQlSortDirections.desc_nulls_last,
	desc: GraphQlSortDirections.asc_nulls_first,
};

// temp_access edge case
const BOOLEAN_NULLS_LAST_ORDER: Record<Avo.Search.OrderDirection, GraphQlSortDirections> = {
	asc: GraphQlSortDirections.desc_nulls_last,
	desc: GraphQlSortDirections.asc_nulls_last,
};

export const getGqlSortDirection = (
	order: Avo.Search.OrderDirection,
	tableColumnDataType: string
): GraphQlSortDirections => {
	switch (tableColumnDataType) {
		case 'string':
		case 'number':
		case 'dateTime':
			return DEFAULT_NULL_ORDER[order];
		case 'boolean':
			return BOOLEAN_ORDER[order];
		case 'booleanNullsLast':
			return BOOLEAN_NULLS_LAST_ORDER[order];
		default:
			return order as GraphQlSortDirections;
	}
};

export const getOrderObject = (
	sortColumn: string,
	sortOrder: Avo.Search.OrderDirection,
	tableColumnDataType: string,
	columns: Partial<{
		[columnName: string]: (order: Avo.Search.OrderDirection) => any;
	}>
): Record<string, GraphQlSortDirections>[] => {
	const getOrderFunc = columns[sortColumn] as ((order: GraphQlSortDirections) => any) | undefined;

	if (getOrderFunc) {
		return [getOrderFunc(getGqlSortDirection(sortOrder, tableColumnDataType))];
	}

	return [{ [sortColumn]: getGqlSortDirection(sortOrder, tableColumnDataType) }];
};
