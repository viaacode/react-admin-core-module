import { AdminConfigManager } from '~core/config/config.class';
import type { ReactSelectOption } from '../types/index';

export const GET_ADMIN_ICON_OPTIONS: () => ReactSelectOption<string>[] = () =>
	AdminConfigManager.getConfig().icon?.list() || [];
