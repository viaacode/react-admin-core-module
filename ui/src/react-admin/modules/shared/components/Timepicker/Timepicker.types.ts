import type { ReactNode } from 'react';
import type { DatePickerProps } from 'react-datepicker';

import type { DefaultComponentProps } from '../../types/components.js';

export type TimepickerProps = DefaultComponentProps &
	DatePickerProps & {
		children?: ReactNode;
		id?: string;
	};
