import { AvoCoreDatabaseType } from '@viaa/avo2-types';
import { getDatabaseType } from '~shared/helpers/get-database-type';

export function isHetArchief(): boolean {
	return getDatabaseType() === AvoCoreDatabaseType.hetArchief;
}
