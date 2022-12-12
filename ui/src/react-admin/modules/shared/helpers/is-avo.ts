import { DatabaseType } from '@viaa/avo2-types';
import { getDatabaseType } from '~modules/shared/helpers/get-database-type';

export function isAvo(): boolean {
	return getDatabaseType() === DatabaseType.avo;
}
