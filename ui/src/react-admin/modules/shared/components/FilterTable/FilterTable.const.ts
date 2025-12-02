import { compact } from 'es-toolkit';
import type { QueryParamConfig } from 'serialize-query-params';
import { NumberParam, StringParam } from '~shared/helpers/use-query-params-ssr';
import { CheckboxListParam, DateRangeParam } from '../../helpers/query-string-converters';
import type { FilterableColumn } from './FilterTable';
import { cleanupFilterTableState } from './FilterTable.utils';

const FILTER_TYPE_TO_QUERY_PARAM_CONVERTER = {
	CheckboxDropdownModal: CheckboxListParam,
	DateRangeDropdown: DateRangeParam,
	BooleanCheckboxDropdown: CheckboxListParam,
	OkNokEmptyCheckboxDropdown: CheckboxListParam,
	MultiUserSelectDropdown: CheckboxListParam,
	MultiEducationalOrganisationSelectModal: CheckboxListParam,
};

// Build an object containing the filterable columns, so they can be converted to and from the query params
export const FILTER_TABLE_QUERY_PARAM_CONFIG = (columns: FilterableColumn[]) => ({
	page: NumberParam,
	...cleanupFilterTableState(
		Object.fromEntries(
			compact(
				// biome-ignore lint/suspicious/noExplicitAny: TODO fix
				columns.map((col): [string, QueryParamConfig<any>] | null => {
					if (col.filterType && FILTER_TYPE_TO_QUERY_PARAM_CONVERTER[col.filterType]) {
						return [col.id, FILTER_TYPE_TO_QUERY_PARAM_CONVERTER[col.filterType]];
					}
					return null;
				})
			)
		)
	),
	query: StringParam,
	sort_column: StringParam,
	sort_order: StringParam,
	columns: CheckboxListParam,
});
