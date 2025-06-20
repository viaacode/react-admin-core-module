export function parseIntOrDefault<T>(text: string, defaultValue: T): number | T {
	const result = parseInt(text, 10);
	if (Number.isNaN(result) || result === Infinity) {
		return defaultValue;
	}
	return result;
}
