export const TranslationKey = {
	TRANSLATIONS_FRONTEND: process.env.TRANSLATIONS_FRONTEND,
	TRANSLATIONS_BACKEND: process.env.TRANSLATIONS_BACKEND,
	TRANSLATIONS_ADMIN_CORE: process.env.TRANSLATIONS_ADMIN_CORE,
};

export type Translations = Record<string, string>;
