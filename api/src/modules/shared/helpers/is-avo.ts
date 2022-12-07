import { DatabaseType } from '@viaa/avo2-types';

export function isAvo(): boolean {
	return process.env.DATABASE_APPLICATION_TYPE === DatabaseType.avo;
}
