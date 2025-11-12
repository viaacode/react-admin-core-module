import { type DatabaseType } from '@viaa/avo2-types'

export function getDatabaseType(): DatabaseType {
	return process.env.DATABASE_APPLICATION_TYPE as DatabaseType
}
