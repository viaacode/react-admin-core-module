import { ButtonAction } from '@viaa/avo2-components';

export function action(label: string, props?: any) {
	return (info: ButtonAction) => {
		console.info(label, props, info);
	};
}
