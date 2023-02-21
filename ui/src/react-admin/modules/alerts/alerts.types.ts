import { DefaultProps } from '@viaa/avo2-components';
import { ReactNode } from 'react';

export interface Alert {
	title: string;
	message: string;
	icon: string;
	userGroups: string[];
	fromDate: string;
	untilDate: string;
	active: boolean;
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
