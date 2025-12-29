import { lowerCase, upperFirst } from 'es-toolkit';
import I18n from 'i18next';
import XHR from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

export async function loadTranslations(adminProxyUrl: string): Promise<void> {
	return new Promise<void>((resolve) => {
		I18n.use(XHR)
			.use(initReactI18next) // passes i18n down to react-i18next
			.init({
				backend: {
					loadPath: `${adminProxyUrl}/admin/translations/nl.json`,
					parse: (data: string) => {
						setTimeout(() => {
							resolve();
						}, 0);
						return JSON.parse(data);
					},
				},
				debug: false,
				keySeparator: '^',
				nsSeparator: '^',
				lng: 'nl',
				fallbackLng: 'nl',
				interpolation: {
					escapeValue: false,
				},
				initImmediate: true,
				react: {
					useSuspense: false,
				},
				parseMissingKeyHandler: (key: string) => {
					if (key.includes('___')) {
						return `${upperFirst(lowerCase(key.split('___').pop() || ''))} ***`;
					}
					return `${key} ***`;
				},
			});
	});
}

export default I18n;
