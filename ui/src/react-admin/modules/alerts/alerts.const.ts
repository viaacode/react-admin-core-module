import { RichTextEditorControl } from '@meemoo/react-components';
import { NumberParam, StringParam, withDefault } from 'use-query-params';
import { array, boolean, date, object, SchemaOf, string } from 'yup';
import { ReactSelectOption, ROUTE_PARTS } from '~modules/shared';
import { Group } from '~modules/shared/consts/user-group.consts';
import { SortDirectionParam } from '~modules/shared/helpers/query-params';
import { AdminConfigManager } from '../../../index-export';
import { AlertFormState } from './alerts.types';

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
			.length(
				1,
				tText(
					'react-admin/modules/alerts/views/alerts-const___selecteer-een-gebruikersgroep'
				)
			),
		icon: string().required(
			tText('react-admin/modules/alerts/views/alerts-const___icoon-is-verplicht')
		),
		active: boolean().required('is required'),
	});
};

// Constants

export const alertUserGroups: { label: string; id: string }[] = [
	{
		label: 'meemoo admin',
		id: Group.MEEMOO_ADMIN,
	},
	{
		label: 'CP admin',
		id: Group.CP_ADMIN,
	},
	{
		label: 'Eindgebruiker',
		id: Group.VISITOR,
	},
	{
		label: 'kiosk',
		id: Group.KIOSK_VISITOR,
	},
];

export const RICH_TEXT_EDITOR_OPTIONS: RichTextEditorControl[] = [
	'undo',
	'redo',
	'separator',
	'bold',
	'underline',
	'italic',
	'link',
];

export const GET_ADMIN_ICON_OPTIONS: () => ReactSelectOption<string>[] = () =>
	AdminConfigManager.getConfig().icon?.list() || [];
