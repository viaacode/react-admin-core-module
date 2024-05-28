import { DefaultProps } from '@viaa/avo2-components';
import { ReactNode } from 'react';
import { Locale } from '~modules/translations/translations.core.types';
import { FilterableTableState } from '~shared/components/FilterTable/FilterTable';

export interface MaintenanceAlert {
	id: string;
	title: string;
	message: string;
	type: string;
	userGroups: string[];
	fromDate: string;
	untilDate: string;
	language: Locale;
}

export interface MaintenanceAlertsOverviewProps extends DefaultProps {
	renderPopup: (info: {
		title: string;
		body: ReactNode;
		isOpen: boolean;
		onSave: () => void;
		onClose: () => void;
	}) => ReactNode;
}

export type MaintenanceAlertsEditFormProps = {
	maintenanceAlert: MaintenanceAlert | null;
	action: 'create' | 'edit' | null;
	onClose: () => void;
	renderPopup: (info: {
		title: string;
		body: ReactNode;
		isOpen: boolean;
		onSave: () => void;
		onClose: () => void;
	}) => ReactNode;
};

export type MaintenanceAlertsOverviewTableCol =
	| 'title'
	| 'fromDate'
	| 'untilDate'
	| 'status'
	| 'language'
	| 'actions';

export interface MaintenanceAlertFormState {
	title: string;
	message?: string;
	fromDate: Date;
	untilDate: Date;
	userGroups: any;
	type: string;
	language: Locale;
}

export interface MaintenanceAlertDto {
	title: string;
	message?: string;
	fromDate: string;
	untilDate: string;
	userGroups: string[];
	type: string;
	language: string;
}

export interface MaintenanceAlertsOverviewTableState extends FilterableTableState {
	query: string;
	language: Locale[];
}
