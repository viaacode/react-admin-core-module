import { AdminConfigManager } from '~core/config';
import { I18n } from '~core/config/config.types';

export const useTranslation = (): I18n => {
	return AdminConfigManager.getConfig().services.i18n;
};
