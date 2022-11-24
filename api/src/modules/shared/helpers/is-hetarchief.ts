import { AvoOrHetArchief } from '../types';

export function isHetArchief(): boolean {
	return process.env.DATABASE_APPLICATION_TYPE === AvoOrHetArchief.hetArchief;
}
