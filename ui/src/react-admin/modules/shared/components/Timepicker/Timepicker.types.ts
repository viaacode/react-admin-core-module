import { ReactNode } from 'react';

import { DefaultComponentProps } from '../../types';
import { DatePickerPropsSchema } from '../DatePicker';

export interface TimepickerProps extends DefaultComponentProps, DatePickerPropsSchema {
	children?: ReactNode;
}
