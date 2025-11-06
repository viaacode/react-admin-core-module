import { DatabaseType } from '@viaa/avo2-types';
import { getDatabaseType } from '~shared/helpers/get-database-type.js';

export function isAvo(): boolean {
	return getDatabaseType() === DatabaseType.avo;
}
