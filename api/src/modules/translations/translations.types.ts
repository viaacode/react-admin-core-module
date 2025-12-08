import { Lookup_Languages_Enum } from '../shared/generated/graphql-db-types-hetarchief';

export type KeyValueTranslations = Record<string, string>;

export interface LanguageInfo {
	languageCode: string;
	languageLabel: string;
}

export const TRANSLATION_SEPARATOR = '___';

export enum App {
	AVO = 'AVO',
	HET_ARCHIEF = 'HET_ARCHIEF',
}
export enum Component {
	ADMIN_CORE = 'ADMIN_CORE',
	FRONTEND = 'FRONTEND',
	BACKEND = 'BACKEND',
}
export type TranslationLocation = string;
export type TranslationKey = string;

export enum ValueType {
	TEXT = 'TEXT',
	HTML = 'HTML',
}

export { Lookup_Languages_Enum as Locale };

export interface TranslationEntry {
	app: App;
	component: Component;
	location: TranslationLocation;
	key: TranslationKey;
	value: string;
	value_type: ValueType | null;
	language: Lookup_Languages_Enum;
}

export interface MultiLanguageTranslationEntry {
	component: Component;
	location: TranslationLocation;
	key: TranslationKey;
	values: Record<Lookup_Languages_Enum, string>;
	value_type: ValueType | null;
}
