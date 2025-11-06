import type { DatabaseType } from '@viaa/avo2-types';
import { AdminConfigManager } from '~core/config/config.class.js';

export function getDatabaseType(): DatabaseType {
	return AdminConfigManager.getConfig().env.DATABASE_APPLICATION_TYPE;
}
