import { compact } from 'es-toolkit';
import type { DateRange } from '~shared/components/DateRangeDropdown/DateRangeDropdown';
import {
	CheckboxListParam,
	DateRangeParam,
	NumberParam,
	type QueryParamEncoderDecoder,
	StringParam,
} from '../../helpers/query-string-converters';
import type { FilterableColumn } from './FilterTable';
import { cleanupFilterTableState } from './FilterTable.utils';

export type QueryParamEncoderDecoderOptions =
	| QueryParamEncoderDecoder<number>
	| QueryParamEncoderDecoder<string>
	| QueryParamEncoderDecoder<string[]>
	| QueryParamEncoderDecoder<boolean>
	| QueryParamEncoderDecoder<DateRange>;

const FILTER_TYPE_TO_QUERY_PARAM_CONVERTER: Record<string, QueryParamEncoderDecoderOptions> = {
	CheckboxDropdownModal: CheckboxListParam,
	DateRangeDropdown: DateRangeParam,
	BooleanCheckboxDropdown: CheckboxListParam,
	OkNokEmptyCheckboxDropdown: CheckboxListParam,
	MultiUserSelectDropdown: CheckboxListParam,
	MultiEducationalOrganisationSelectModal: CheckboxListParam,
};

// Build an object containing the filterable columns, so they can be converted to and from the query params
export const GET_FILTER_TABLE_QUERY_PARAM_CONFIG = (
	columns: FilterableColumn[]
): Record<string, QueryParamEncoderDecoderOptions> => ({
	page: NumberParam,
	...cleanupFilterTableState(
		Object.fromEntries(
			compact(
				columns.map((col): [string, QueryParamEncoderDecoderOptions] | null => {
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
