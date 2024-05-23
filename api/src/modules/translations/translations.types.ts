import { Lookup_Languages_Enum } from '../shared/generated/graphql-db-types-hetarchief';

export const TranslationKey = {
	TRANSLATIONS_FRONTEND: process.env.TRANSLATIONS_FRONTEND,
	TRANSLATIONS_BACKEND: process.env.TRANSLATIONS_BACKEND,
	TRANSLATIONS_ADMIN_CORE: process.env.TRANSLATIONS_ADMIN_CORE,
};

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
export type Location = string;
export type Key = string;

export enum ValueType {
	TEXT = 'TEXT',
	HTML = 'HTML',
}

export enum Locale {
	nl = 'nl',
	en = 'en',
}
export { Lookup_Languages_Enum as LanguageCode };

export interface TranslationEntry {
	app: App;
	component: Component;
	location: Location;
	key: Key;
	value: string;
	value_type: ValueType | null;
	language: Lookup_Languages_Enum;
}

export interface MultiLanguageTranslationEntry {
	component: Component;
	location: Location;
	key: Key;
	values: Record<Lookup_Languages_Enum, string>;
	value_type: ValueType | null;
}
