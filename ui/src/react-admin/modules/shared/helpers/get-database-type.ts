import type { AvoCoreDatabaseType } from '@viaa/avo2-types';
import { AdminConfigManager } from '~core/config/config.class';

export function getDatabaseType(): AvoCoreDatabaseType {
	return AdminConfigManager.getConfig().env.DATABASE_APPLICATION_TYPE;
}
