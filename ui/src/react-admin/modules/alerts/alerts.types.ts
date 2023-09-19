import { DefaultProps } from '@viaa/avo2-components';
import { ReactNode } from 'react';

export interface Alert {
	id: string;
	title: string;
	message: string;
	type: string;
	userGroups: string[];
	fromDate: string;
	untilDate: string;
}

export interface AlertsOverviewProps extends DefaultProps {
	renderPopup: (info: {
		title: string;
		body: ReactNode;
		isOpen: boolean;
		onSave: () => void;
		onClose: () => void;
	}) => ReactNode;
}

export type AlertsOverviewTableCol = 'id' | 'icon' | 'fromDate' | 'untilDate' | 'active';

export interface AlertFormState {
	title: string;
	message?: string;
	fromDate: Date;
	untilDate: Date;
	userGroups: any;
	type: string;
}

export interface AlertDto {
	title: string;
	message?: string;
	fromDate: string;
	untilDate: string;
	userGroups: string[];
	type: string;
}
