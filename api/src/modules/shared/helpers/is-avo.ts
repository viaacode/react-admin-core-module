import { AvoOrHetArchief } from '../types';
import { getDatabaseType } from './get-database-type';

export function isAvo(): boolean {
	return getDatabaseType() === AvoOrHetArchief.avo;
}
