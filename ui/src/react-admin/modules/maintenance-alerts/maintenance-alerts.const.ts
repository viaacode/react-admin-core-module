import type { RichTextEditorControl } from '@meemoo/react-components';
import type { Schema } from 'yup';
import { array, mixed, object, string } from 'yup';
import { AdminConfigManager } from '~core/config/config.class.js';
import type { MaintenanceAlert } from '~modules/maintenance-alerts/maintenance-alerts.types.js';
import { Locale } from '~modules/translations/translations.core.types.js';
import { tText } from '~shared/helpers/translation-functions.js';

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
				tText('react-admin/modules/alerts/views/alerts-const___selecteer-een-gebruikersgroep')
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
