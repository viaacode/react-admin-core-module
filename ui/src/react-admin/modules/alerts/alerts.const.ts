import { NumberParam, StringParam, withDefault } from 'use-query-params';
import { ROUTE_PARTS } from '~modules/shared';
import { SortDirectionParam } from '~modules/shared/helpers/query-params';

export const ALERTS_PATH = {
	ALERTS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.alerts}`,
};

export const ALERTS_QUERY_PARAM_CONFIG = {
	orderProp: withDefault(StringParam, 'fromDate'),
	orderDirection: withDefault(SortDirectionParam, 'asc'),
	page: withDefault(NumberParam, 1),
};
