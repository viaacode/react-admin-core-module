export function findValueDeep(
	// biome-ignore lint/suspicious/noExplicitAny: todo
	obj: any,
	// biome-ignore lint/suspicious/noExplicitAny: todo
	predicate: (key: string | number, value: any) => boolean,
	// biome-ignore lint/suspicious/noExplicitAny: todo
): any | null {
	// biome-ignore lint/suspicious/noExplicitAny: todo
	let foundObj: any | null;
	JSON.stringify(obj, (nestedKey, nestedValue) => {
		if (!foundObj && predicate(nestedKey, nestedValue)) {
			foundObj = nestedValue;
		}
		return nestedValue;
	});
	return foundObj;
}
