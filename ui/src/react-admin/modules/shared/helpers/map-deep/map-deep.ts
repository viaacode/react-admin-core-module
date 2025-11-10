import { isPlainObject } from 'es-toolkit';

/**
 * Recursively runs over every property, and replaces it with the return value of the mapping function
 * @param obj
 * @param mappingFunction
 * @param ignoreKey function that identifies keys that should not be recursively followed
 */
export function mapDeep(
	// biome-ignore lint/suspicious/noExplicitAny: todo
	obj: any,
	// biome-ignore lint/suspicious/noExplicitAny: todo
	mappingFunction: (obj: any, key: string, value: any) => void,
	ignoreKey: (key: string) => boolean
	// biome-ignore lint/suspicious/noExplicitAny: todo
): any {
	// biome-ignore lint/suspicious/noExplicitAny: todo
	const returnObj: any = isPlainObject(obj) ? {} : [];
	// biome-ignore lint/suspicious/noExplicitAny: todo
	const propertiesToRunOver: [any, any, string | number][] = []; // [source object, destination object, key]

	propertiesToRunOver.push(
		...Object.keys(obj).map(
			// biome-ignore lint/suspicious/noExplicitAny: todo
			(key: string | number): [any, any, string | number] => [obj, returnObj, key]
		)
	);

	let propToRunOver = propertiesToRunOver.shift();
	while (propToRunOver) {
		const [currentSubObject, responseSubObj, key] = propToRunOver;
		const value = currentSubObject[key];

		mappingFunction(responseSubObj, String(key), value);

		// Add next layer of props in object to the processing queue
		if (!ignoreKey(String(key))) {
			if (isPlainObject(value) || Array.isArray(value)) {
				propertiesToRunOver.push(
					...Object.keys(value).map(
						// biome-ignore lint/suspicious/noExplicitAny: todo
						(subObjKey: string | number): [any, any, string | number] => [
							value,
							responseSubObj[key],
							subObjKey,
						]
					)
				);
			}
		}

		propToRunOver = propertiesToRunOver.shift();
	}
	return returnObj;
}
