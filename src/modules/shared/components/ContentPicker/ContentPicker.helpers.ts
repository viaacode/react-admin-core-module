import { get } from 'lodash';

import {
	PickerItem,
	PickerItemControls,
	PickerSelectItem,
	PickerTypeOption,
} from '../../types/content-picker';

import { ContentPickerType } from 'modules/shared/components/ContentPicker/ContentPicker.const';

export const filterTypes = (
	types: PickerTypeOption<ContentPickerType>[],
	allowedTypes: ContentPickerType[]
) => {
	return types.filter((option: PickerTypeOption) => {
		return allowedTypes.length ? allowedTypes.includes(option.value) : option.value;
	});
};

export const setInitialInput = (type?: PickerTypeOption, initialValue?: PickerItem) => {
	switch (get(type, 'picker') as PickerItemControls) {
		case 'TEXT_INPUT':
		case 'FILE_UPLOAD':
			return get(initialValue, 'value', '');

		default:
			return '';
	}
};

export const setInitialItem = (
	options: PickerSelectItem[],
	initialValue?: PickerItem
): PickerItem | undefined => {
	return options.find(
		(option: PickerSelectItem) =>
			option.value.value === get(initialValue, 'value', 'EMPTY_SELECTION')
	)?.value;
};
