import type { ReactSelectOption } from '../types';

import { AdminConfigManager } from '~core/config';

export const GET_ADMIN_ICON_OPTIONS: () => ReactSelectOption<string>[] = () =>
	AdminConfigManager.getConfig().icon?.list() || [];
