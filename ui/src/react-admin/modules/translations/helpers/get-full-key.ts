import {
	Component,
	Key,
	Location,
	TRANSLATION_SEPARATOR,
	TranslationEntry,
} from '../translations.core.types';
import { MultiLanguageTranslationEntry } from '../translations.types';

export function getFullKey(
	translationEntry: TranslationEntry | MultiLanguageTranslationEntry
): `${Component}${typeof TRANSLATION_SEPARATOR}${Location}${typeof TRANSLATION_SEPARATOR}${Key}` {
	return `${translationEntry.component}${TRANSLATION_SEPARATOR}${translationEntry.location}${TRANSLATION_SEPARATOR}${translationEntry.key}`;
}
