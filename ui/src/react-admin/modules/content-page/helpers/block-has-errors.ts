// biome-ignore lint/suspicious/noExplicitAny: doesn't matter what the value is, we only need to check if there are any keys
export function blockHasErrors(errors: Record<string, any> = {}) {
	return Object.keys(errors).length > 0;
}
