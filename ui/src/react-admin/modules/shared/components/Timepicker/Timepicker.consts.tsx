import { TextInput } from '@meemoo/react-components';
import nlBE from 'date-fns/locale/nl-BE/index.js';
import { DatePickerPropsSchema, Icon } from '~shared/components';

export const timePickerDefaults: Partial<DatePickerPropsSchema> = {
	dateFormat: 'HH:mm',
	showTimeSelect: true,
	showTimeSelectOnly: true,
	timeIntervals: 15,
	autoComplete: 'off', // html prop
	customInput: <TextInput iconStart={<Icon name="clock" />} />,
	locale: nlBE,
};
