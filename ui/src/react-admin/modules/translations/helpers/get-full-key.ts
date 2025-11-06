import type { Component, Key, Location, TranslationEntry } from '../translations.core.types.js';
import { TRANSLATION_SEPARATOR } from '../translations.core.types.js';
import type { MultiLanguageTranslationEntry } from '../translations.types.js';

export function getFullKey(
	translationEntry: TranslationEntry | MultiLanguageTranslationEntry
): `${Component}${typeof TRANSLATION_SEPARATOR}${Location}${typeof TRANSLATION_SEPARATOR}${Key}` {
	return `${translationEntry.component}${TRANSLATION_SEPARATOR}${translationEntry.location}${TRANSLATION_SEPARATOR}${translationEntry.key}`;
}
