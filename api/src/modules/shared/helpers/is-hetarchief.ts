import { AvoOrHetArchief } from '../types';
import { getDatabaseType } from './get-database-type';

export function isHetArchief(): boolean {
	return getDatabaseType() === AvoOrHetArchief.hetArchief;
}
