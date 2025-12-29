import type { AvoCoreDatabaseType } from '@viaa/avo2-types';

export function getDatabaseType(): AvoCoreDatabaseType {
	return process.env.DATABASE_APPLICATION_TYPE as AvoCoreDatabaseType;
}
