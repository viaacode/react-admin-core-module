import { TextInput } from '@meemoo/react-components';
import React from 'react';
import type { ReactDatePickerProps } from 'react-datepicker';
import { Icon } from '~shared/components/Icon/Icon';
import nlBE from 'date-fns/locale/nl-BE/index.js';
import { Locale } from '~modules/translations/translations.core.types';
import enGB from 'date-fns/locale/en-GB/index.js';
import { AdminConfigManager } from '~core/config';

export function getDatePickerDefaultProps(): Partial<
	Omit<ReactDatePickerProps, 'minDate'> & { minDate: Date | undefined; maxDate: Date | undefined }
> {
	return {
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
		locale: { [Locale.Nl]: nlBE, [Locale.En]: enGB }[AdminConfigManager.getConfig().locale],
		minDate: undefined,
	};
}
