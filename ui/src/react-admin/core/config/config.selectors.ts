import type { AvoUserCommonUser } from '@viaa/avo2-types';
import { AdminConfigManager } from '~core/config/config.class';

export function getCommonUser(): AvoUserCommonUser | undefined {
	return AdminConfigManager.getConfig().users?.getCommonUser() || undefined;
}
