import type { RichTextEditorControl } from '@meemoo/react-components';
import { NumberParam, StringParam, withDefault } from 'use-query-params';
import type { Schema} from 'yup';
import { array, mixed, object, string } from 'yup';
import { AdminConfigManager } from '~core/config';
import type { MaintenanceAlert } from '~modules/maintenance-alerts/maintenance-alerts.types';
import { ROUTE_PARTS } from '~modules/shared';
import { SortDirectionParam } from '~modules/shared/helpers/query-params';
import { Locale } from '~modules/translations/translations.core.types';
import { tText } from '~shared/helpers/translation-functions';

export const ALERTS_PATH = {
	ALERTS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.alerts}`,
};

export const ALERTS_QUERY_PARAM_CONFIG = {
	orderProp: withDefault(StringParam, 'fromDate'),
	orderDirection: withDefault(SortDirectionParam, 'desc'),
	page: withDefault(NumberParam, 1),
};

// Yup

export const ALERTS_FORM_SCHEMA = (): Schema<Partial<MaintenanceAlert>> => {
	return object({
		title: string().required(
			tText('react-admin/modules/alerts/views/alerts-const___titel-is-verplicht')
		),
		message: string(),
		fromDate: string()
			.required(tText('react-admin/modules/alerts/views/alerts-const___datum-is-verplicht'))
			.datetime(),
		untilDate: string()
			.required(tText('react-admin/modules/alerts/views/alerts-const___datum-is-verplicht'))
			.datetime(),
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
		language: mixed<Locale>()
			.oneOf(Object.values(Locale))
			.required(tText('modules/maintenance-alerts/maintenance-alerts___taal-is-verplicht')),
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
