import { AvoCoreDatabaseType } from '@viaa/avo2-types';
import { getDatabaseType } from '~shared/helpers/get-database-type';

export function isAvo(): boolean {
	return getDatabaseType() === AvoCoreDatabaseType.avo;
}
