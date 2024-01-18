export function findValueDeep(
	obj: any,
	predicate: (key: string | number, value: any) => boolean
): any | null {
	let foundObj: any | null;
	JSON.stringify(obj, (nestedKey, nestedValue) => {
		if (!foundObj && predicate(nestedKey, nestedValue)) {
			foundObj = nestedValue;
		}
		return nestedValue;
	});
	return foundObj;
}
