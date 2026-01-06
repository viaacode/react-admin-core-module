import type { AvoUserCommonUser } from '@viaa/avo2-types';
import { AdminConfigManager } from '~core/config/config.class';

export function getCommonUser(): AvoUserCommonUser | undefined {
	console.log('getting admin-core config', {
		config: AdminConfigManager.getConfig(),
		commonUser: AdminConfigManager.getConfig().users?.getCommonUser(),
	});
	return AdminConfigManager.getConfig().users?.getCommonUser() || undefined;
}
