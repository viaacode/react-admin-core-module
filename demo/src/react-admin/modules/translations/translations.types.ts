export type Translation = [string, string];

export interface TranslationV2 {
	key: string; // Key in translation object in the database
	value: string; // Value of the translation in the translation object in the database
	context: string; // Name of the config row that stores the translation object. eg: TRANSLATIONS_FRONTEND, TRANSLATIONS_BACKEND, TRANSLATIONS_ADMIN_CORE
	label: string; // Display value in the application === context + '/' + key
}

export interface TranslationsState {
	name: string;
	value: any;
}
