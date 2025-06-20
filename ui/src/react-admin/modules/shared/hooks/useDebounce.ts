import { useEffect, useState } from 'react';

// biome-ignore lint/suspicious/noExplicitAny: todo
export function useDebounce(value: any, delay: number): any {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}
