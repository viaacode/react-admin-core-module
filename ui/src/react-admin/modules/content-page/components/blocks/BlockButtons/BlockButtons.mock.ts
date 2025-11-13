import { Avo } from '@viaa/avo2-types';
import type { ButtonProps } from './BlockButtons';

export const BUTTONS_MOCK: ButtonProps[] = [
	{
		label: 'Knop 1',
		buttonAction: {
			type: Avo.Core.ContentPickerType.EXTERNAL_LINK,
			value: 'http://google.com',
		},
	},
	{
		label: 'Knop 2',
		buttonAction: {
			type: Avo.Core.ContentPickerType.ANCHOR_LINK,
			value: 'title-3',
		},
	},
];
