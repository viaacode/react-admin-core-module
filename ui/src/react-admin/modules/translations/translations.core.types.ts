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
	Nl = 'nl',
	En = 'en',
}

export interface TranslationEntry {
	app: App;
	component: Component;
	location: Location;
	key: Key;
	language: Locale;
	value: string;
	value_type: ValueType | null;
}

export const TRANSLATION_SEPARATOR = '___';
