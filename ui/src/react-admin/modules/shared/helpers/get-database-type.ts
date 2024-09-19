import type { DatabaseType } from '@viaa/avo2-types';
import { AdminConfigManager } from '~core/config';

export function getDatabaseType(): DatabaseType {
	return AdminConfigManager.getConfig().database.databaseApplicationType;
}
