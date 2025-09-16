import { isArray, isEmpty, isNil, isPlainObject, isString, omitBy } from 'lodash-es';

// Removes all props where the value is undefined, null, [], {}, ''
export function cleanupFilterTableState(obj: any) {
	return omitBy(
		obj,
		(value: any) =>
			isNil(value) ||
			(isString(value) && !value.length) ||
			((isPlainObject(value) || isArray(value)) && isEmpty(value)) ||
			(isPlainObject(value) && value.gte === '' && value.lte === '')
	);
}

export function getColumnKey(key: string) {
	const parsed = key.replaceAll('/', '_').toUpperCase();
	return parsed.startsWith('_') ? parsed.substring(1) : parsed;
}
