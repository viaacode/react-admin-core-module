import { Config, I18n } from '../../../core/config';

export const useTranslation = (): I18n => {
	return Config.getConfig().services.i18n;
};
