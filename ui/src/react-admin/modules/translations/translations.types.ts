import type { DefaultProps } from '@viaa/avo2-components';
import type { ReactNode } from 'react';
import type {
	Component,
	Key,
	Locale,
	Location,
	ValueType,
} from '~modules/translations/translations.core.types.js';

export interface TranslationsOverviewProps extends DefaultProps {
	renderPopup: (info: {
		title: string;
		body: ReactNode;
		isOpen: boolean;
		onSave: () => void;
		onClose: () => void;
	}) => ReactNode;
}

export interface MultiLanguageTranslationEntry {
	component: Component;
	location: Location;
	key: Key;
	values: Record<Locale, string>;
	value_type: ValueType | null;
}

export interface LanguageInfo {
	languageCode: Locale;
	languageLabel: string;
}
