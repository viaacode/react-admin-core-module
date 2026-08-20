import type { LinkTarget } from '@viaa/avo2-components';
import type { AvoCoreContentPickerType } from '@viaa/avo2-types';

export type PickerItemControls = 'SELECT' | 'TEXT_INPUT' | 'FILE_UPLOAD';

export interface PickerItem {
	label?: string;
	type: AvoCoreContentPickerType;
	value: string;
	dctermsFormat?: string;
	target?: LinkTarget;
}

export interface PickerTypeOption<T = AvoCoreContentPickerType> {
	value: T;
	label: string;
	disabled?: boolean;
	picker: PickerItemControls;
	fetch?: (
		keyword: string | null,
		limit: number,
		pickerType?: AvoCoreContentPickerType,
		// Optional dcterms formats to restrict the results to. Only honoured by the ie-object
		// provider, which uses it so blocks can offer AV objects only.
		formats?: string[]
	) => Promise<PickerItem[]>;
	placeholder?: string;
}
