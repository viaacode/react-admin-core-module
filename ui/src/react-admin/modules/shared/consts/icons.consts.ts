import { AdminConfigManager } from '~core/config/config.class.js';
import type { ReactSelectOption } from '../types/index.js';

export const GET_ADMIN_ICON_OPTIONS: () => ReactSelectOption<string>[] = () =>
	AdminConfigManager.getConfig().icon?.list() || [];
