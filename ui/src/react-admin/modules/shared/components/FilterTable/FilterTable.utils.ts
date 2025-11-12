import { isNil, isPlainObject, isString, omitBy } from 'es-toolkit';
import { isEmpty } from 'es-toolkit/compat';

// Removes all props where the value is undefined, null, [], {}, ''
// biome-ignore lint/suspicious/noExplicitAny: TODO fix
export function cleanupFilterTableState(obj: any) {
	return omitBy(
		obj,
		// biome-ignore lint/suspicious/noExplicitAny: TODO fix
		(value: any) =>
			isNil(value) ||
			(isString(value) && !value.length) ||
			((isPlainObject(value) || Array.isArray(value)) && isEmpty(value)) ||
			(isPlainObject(value) && value.gte === '' && value.lte === '')
	);
}

export function getColumnKey(key: string) {
	const parsed = key.replaceAll('/', '_').toUpperCase();
	return parsed.startsWith('_') ? parsed.substring(1) : parsed;
}
