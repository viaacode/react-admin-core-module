import { Locale } from '~modules/translations/translations.core.types.js';
import { tText } from '~shared/helpers/translation-functions.js';

export function GET_LANGUAGE_NAMES(): Record<Locale, string> {
	return {
		[Locale.Nl]: tText('modules/shared/consts/language-names___nederlands'),
		[Locale.En]: tText('modules/shared/consts/language-names___engels'),
	};
}
