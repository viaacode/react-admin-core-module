import { TextInput } from '@meemoo/react-components';
import { enGB, nlBE } from 'date-fns/locale';
import React from 'react';
import type { DatePickerProps } from 'react-datepicker';
import { AdminConfigManager } from '~core/config/config.class';
import { Locale } from '~modules/translations/translations.core.types';
import { Icon } from '~shared/components/Icon/Icon';
import { tText } from '~shared/helpers/translation-functions.ts';

export function getDatePickerDefaultProps(): DatePickerProps {
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
		customInput: (
			<TextInput
				id="date-picker__input-field"
				iconStart={<Icon name="calendar" />}
				ariaLabel={tText('Datum [INPUT_ARIA_LABEL]')}
				value=""
			/>
		),
		popperPlacement: 'bottom-start',
		locale: { [Locale.Nl]: nlBE, [Locale.En]: enGB }[AdminConfigManager.getConfig().locale],
		minDate: undefined,
	};
}
