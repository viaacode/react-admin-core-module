import { RichTextEditorControl } from '@meemoo/react-components';
import { NumberParam, StringParam, withDefault } from 'use-query-params';
import { array, object, SchemaOf, string } from 'yup';
import { AdminConfigManager } from '~core/config';
import { ROUTE_PARTS } from '~modules/shared';
import { SortDirectionParam } from '~modules/shared/helpers/query-params';
import { AlertFormState } from './alerts.types';

export const ALERTS_PER_PAGE = 20;

export const ALERTS_PATH = {
	ALERTS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.alerts}`,
};

export const ALERTS_QUERY_PARAM_CONFIG = {
	orderProp: withDefault(StringParam, 'fromDate'),
	orderDirection: withDefault(SortDirectionParam, 'asc'),
	page: withDefault(NumberParam, 1),
};

// Yup

export const ALERTS_FORM_SCHEMA = (tText: any): SchemaOf<AlertFormState> => {
	return object({
		title: string().required(
			tText('react-admin/modules/alerts/views/alerts-const___titel-is-verplicht')
		),
		message: string().required(
			tText('react-admin/modules/alerts/views/alerts-const___beschrijving-is-verplicht')
		),
		fromDate: string().required(
			tText('react-admin/modules/alerts/views/alerts-const___datum-is-verplicht')
		),
		untilDate: string().required(
			tText('react-admin/modules/alerts/views/alerts-const___datum-is-verplicht')
		),
		userGroups: array()
			.of(string().required('is required'))
			.min(
				1,
				tText(
					'react-admin/modules/alerts/views/alerts-const___selecteer-een-gebruikersgroep'
				)
			),
		type: string().required(
			tText('react-admin/modules/alerts/views/alerts-const___icoon-is-verplicht')
		),
	});
};

// Constants

export const RICH_TEXT_EDITOR_OPTIONS: RichTextEditorControl[] = [
	'undo',
	'redo',
	'separator',
	'bold',
	'underline',
	'italic',
	'link',
];

export const GET_ALERTS_ICON_OPTIONS: () => {
	key: string;
	value: string;
	label: string;
}[] = () => AdminConfigManager.getConfig().icon?.alerts() || [];
