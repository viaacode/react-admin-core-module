import type { ButtonAction } from '@viaa/avo2-components';
import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import type { ImageInfo } from './BlockSpotlight';

const MOCK_BUTTON_ACTION: ButtonAction = {
	type: AvoCoreContentPickerType.EXTERNAL_LINK,
	value: 'http://google.com',
};

export const MOCK_SPOTLIGHT_PROJECTS: ImageInfo[] = [
	{
		image: 'https://placeholder.com/500x200',
		title: 'Big item',
		buttonAction: MOCK_BUTTON_ACTION,
	},
	{
		image: 'https://placeholder.com/500x200',
		title: 'Small item',
		buttonAction: MOCK_BUTTON_ACTION,
	},
	{
		image: 'https://placeholder.com/500x200',
		title: 'Small item bis',
		buttonAction: undefined,
	},
];
