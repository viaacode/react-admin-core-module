import { ReactNode } from 'react';
import { DefaultProps } from '@viaa/avo2-components';

export interface Translation {
	key: string; // Key in translation object in the database
	value: string; // Value of the translation in the translation object in the database
	context: TranslationContextName; // Name of the config row that stores the translation object. eg: TRANSLATIONS_FRONTEND, TRANSLATIONS_BACKEND, TRANSLATIONS_ADMIN_CORE
	label: string; // Display value in the application === context + '/' + key
}

export interface TranslationsOverviewProps extends DefaultProps {
	renderPopup: (info: {
		title: string;
		body: ReactNode;
		isOpen: boolean;
		onSave: () => void;
		onClose: () => void;
	}) => ReactNode;
}

export enum TranslationContextName {
	TRANSLATIONS_FRONTEND = 'TRANSLATIONS_FRONTEND',
	TRANSLATIONS_BACKEND = 'TRANSLATIONS_BACKEND',
	TRANSLATIONS_ADMIN_CORE = 'TRANSLATIONS_ADMIN_CORE',
}
