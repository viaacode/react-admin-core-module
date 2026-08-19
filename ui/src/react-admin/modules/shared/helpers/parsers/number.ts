export function parseIntOrDefault<T>(text: string, defaultValue: T): number | T {
	const result = Number.parseInt(text, 10);
	if (Number.isNaN(result) || result === Number.POSITIVE_INFINITY) {
		return defaultValue;
	}
	return result;
}
