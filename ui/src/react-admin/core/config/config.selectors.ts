import type { Avo } from '@viaa/avo2-types';
import { AdminConfigManager } from '~core/config/config.class.js';

export function getCommonUser(): Avo.User.CommonUser | undefined {
	return AdminConfigManager.getConfig().users?.getCommonUser() || undefined;
}
