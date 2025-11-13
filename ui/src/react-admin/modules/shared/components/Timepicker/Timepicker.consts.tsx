import { TextInput } from '@meemoo/react-components';
import nlBE from 'date-fns/locale/nl-BE/index';
import type { DatePickerProps } from 'react-datepicker';
import { Icon } from '~shared/components/Icon/Icon';

export const timePickerDefaults: DatePickerProps = {
	dateFormat: 'HH:mm',
	showTimeSelect: true,
	showTimeSelectOnly: true,
	timeIntervals: 15,
	autoComplete: 'off', // html prop
	customInput: <TextInput iconStart={<Icon name="clock" />} />,
	locale: nlBE,
};
