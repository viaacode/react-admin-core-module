import { lowerCase, upperFirst } from 'lodash-es';
import { i18n as i18next } from 'next-i18next';

export const i18n = {
	t: (translationKey: string, variables?: Record<string, string>): string => {
		let translatedValue: string | undefined = i18next?.t(translationKey, variables);
		if (!translatedValue) {
			if (translationKey.includes('___')) {
				translatedValue = `${upperFirst(lowerCase(translationKey.split('___').pop()))} ***`;
			} else {
				translatedValue = `${translationKey} ***`;
			}
		}
		return translatedValue;
	},
};
