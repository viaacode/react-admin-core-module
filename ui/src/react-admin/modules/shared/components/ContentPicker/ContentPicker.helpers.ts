import { get } from 'lodash-es';

import { PickerItem, PickerItemControls, PickerTypeOption } from '../../types/content-picker';

import type { Avo } from '@viaa/avo2-types';

export function filterTypes(types: PickerTypeOption[], allowedTypes: Avo.Core.ContentPickerType[]) {
	return types.filter((option: PickerTypeOption) => {
		return allowedTypes.length ? allowedTypes.includes(option.value) : option.value;
	});
}

export function setInitialInput(type?: PickerTypeOption, initialValue?: PickerItem) {
	switch (get(type, 'picker') as PickerItemControls) {
		case 'TEXT_INPUT':
		case 'FILE_UPLOAD':
			return get(initialValue, 'value', '');

		default:
			return '';
	}
}

export function setInitialItem(
	options: PickerItem[],
	initialValue?: PickerItem
): PickerItem | undefined {
	return options.find(
		(option: PickerItem) => option.value === get(initialValue, 'value', 'EMPTY_SELECTION')
	);
}
