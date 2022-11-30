import { AvoOrHetArchief } from '../types';

export function getDatabaseType(): AvoOrHetArchief {
	return process.env.DATABASE_APPLICATION_TYPE as AvoOrHetArchief;
}
