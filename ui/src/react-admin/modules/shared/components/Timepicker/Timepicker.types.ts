import type { ReactNode } from 'react';
import type { ReactDatePickerProps } from 'react-datepicker';

import type { DefaultComponentProps } from '../../types/components.js';

export interface TimepickerProps extends DefaultComponentProps, ReactDatePickerProps {
	children?: ReactNode;
}
