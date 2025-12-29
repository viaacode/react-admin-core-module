import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import type { ButtonProps } from './BlockButtons';

export const BUTTONS_MOCK: ButtonProps[] = [
	{
		label: 'Knop 1',
		buttonAction: {
			type: AvoCoreContentPickerType.EXTERNAL_LINK,
			value: 'http://google.com',
		},
	},
	{
		label: 'Knop 2',
		buttonAction: {
			type: AvoCoreContentPickerType.ANCHOR_LINK,
			value: 'title-3',
		},
	},
];
