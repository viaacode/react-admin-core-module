import { DatabaseType } from '@viaa/avo2-types'

export function isHetArchief(): boolean {
	return process.env.DATABASE_APPLICATION_TYPE === DatabaseType.hetArchief
}
