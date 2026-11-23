import type { AvoCoreContentPickerType } from '@viaa/avo2-types';
import { isHetArchief } from '~shared/helpers/is-hetarchief';
import { AVO, HET_ARCHIEF } from '~shared/types';
import type { PickerItem, PickerItemControls, PickerTypeOption } from '../../types/content-picker';

export function filterTypes(
	types: PickerTypeOption[],
	allowedTypes: AvoCoreContentPickerType[]
): PickerTypeOption[] {
	const currentApp = isHetArchief() ? HET_ARCHIEF : AVO;
	return types.filter((option: PickerTypeOption) => {
		if (!option.apps.includes(currentApp)) {
			return false;
		}
		return allowedTypes.length ? allowedTypes.includes(option.value) : option.value;
	});
}

export function setInitialInput(type?: PickerTypeOption, initialValue?: PickerItem) {
	switch (type?.picker as PickerItemControls) {
		case 'TEXT_INPUT':
		case 'FILE_UPLOAD':
			return initialValue?.value || '';

		default:
			return '';
	}
}

export function setInitialItem(
	options: PickerItem[],
	initialValue?: PickerItem
): PickerItem | undefined {
	if (!initialValue?.value) {
		return undefined;
	}
	return options.find((option: PickerItem) => option.value === initialValue.value);
}
