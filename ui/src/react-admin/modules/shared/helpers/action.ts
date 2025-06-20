import type { ButtonAction } from '@viaa/avo2-components';

// biome-ignore lint/suspicious/noExplicitAny: todo
export function action(label: string, props?: any) {
	return (info: ButtonAction) => {
		console.info(label, props, info);
	};
}
