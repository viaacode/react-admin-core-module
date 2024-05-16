import { ButtonType, SelectOption } from '@viaa/avo2-components';
import { tText } from '~shared/helpers/translation-functions';

export const GET_UNDERLINED_LINK_BUTTON_TYPE_OPTIONS: () => SelectOption<ButtonType>[] = () => [
	{
		label: tText('admin/content-block/content-block___blauw'),
		value: 'underlined-link',
	},
	{
		label: tText('admin/content-block/content-block___geel'),
		value: 'pupil-underlined-link',
	},
];
