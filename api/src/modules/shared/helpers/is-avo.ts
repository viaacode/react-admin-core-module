import { AvoOrHetArchief } from '../types';

export function isAvo(): boolean {
	return process.env.DATABASE_APPLICATION_TYPE === AvoOrHetArchief.avo;
}
