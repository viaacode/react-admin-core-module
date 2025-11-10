import type { MultiLanguageTranslationEntry } from '~modules/translations/translations.types.js';
import {
	type Component,
	type Key,
	type Location,
	TRANSLATION_SEPARATOR,
	type TranslationEntry,
} from '../../../../../scripts/translation.types.js';

export function getFullKey(
	translationEntry: TranslationEntry | MultiLanguageTranslationEntry
): `${Component}${typeof TRANSLATION_SEPARATOR}${Location}${typeof TRANSLATION_SEPARATOR}${Key}` {
	return `${translationEntry.component}${TRANSLATION_SEPARATOR}${translationEntry.location}${TRANSLATION_SEPARATOR}${translationEntry.key}`;
}
