import { TextInput } from '@meemoo/react-components';
import nlBE from 'date-fns/locale/nl-BE/index.js';
import type { ReactDatePickerProps } from 'react-datepicker';
import { Icon } from '~shared/components/Icon';

export const timePickerDefaults: Partial<ReactDatePickerProps> = {
	dateFormat: 'HH:mm',
	showTimeSelect: true,
	showTimeSelectOnly: true,
	timeIntervals: 15,
	autoComplete: 'off', // html prop
	customInput: <TextInput iconStart={<Icon name="clock" />} />,
	locale: nlBE,
};
