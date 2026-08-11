import type { ReactNode } from 'react';
import type { DatePickerProps } from 'react-datepicker';
import type { DatePickerPropsSchema } from '~modules/content-page/components/DatePicker/DatePicker.consts.tsx';
import type { DefaultComponentProps } from '../../types/components';

export type TimepickerProps = DefaultComponentProps &
	DatePickerPropsSchema & {
		children?: ReactNode;
		id: string;
		showTimeSelect: DatePickerProps['showTimeSelect'];
		showTimeSelectOnly: DatePickerProps['showTimeSelectOnly'];
		timeIntervals: DatePickerProps['timeIntervals'];
		autoComplete: DatePickerProps['autoComplete'];
		name?: DatePickerProps['name'];
		onBlur?: DatePickerProps['onBlur'];
		value?: DatePickerProps['value'];
	};
