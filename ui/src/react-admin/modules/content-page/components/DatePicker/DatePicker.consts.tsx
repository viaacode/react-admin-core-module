import { TextInput } from '@meemoo/react-components';
import React from 'react';
import Icon from '~shared/components/Icon/Icon';
import nlBE from 'date-fns/locale/nl-BE/index.js';
import { DatePickerPropsSchema } from '~modules/shared/components';

export const datePickerDefaultProps: Partial<DatePickerPropsSchema> = {
	wrapperClassName: 'c-datepicker',
	calendarClassName: 'c-datepicker',
	popperClassName: 'c-datepicker',
	showPopperArrow: false,
	showMonthDropdown: true,
	showYearDropdown: true,
	dropdownMode: 'select' as const,
	calendarStartDay: 1,
	dateFormat: 'dd/MM/yyyy',
	placeholderText: 'dd/mm/jjjj',
	customInput: <TextInput iconStart={<Icon name="calendar" />} />,
	popperPlacement: 'bottom-start',
	locale: nlBE,
	minDate: undefined,
};
