import { TextInput } from '@meemoo/react-components';
import type { DefaultProps } from '@viaa/avo2-components';
import { enGB, nlBE } from 'date-fns/locale';
import React from 'react';
import type { DatePickerProps } from 'react-datepicker';
import { AdminConfigManager } from '~core/config/config.class';
import { Locale } from '~modules/translations/translations.core.types';
import { Icon } from '~shared/components/Icon/Icon';
import { tText } from '~shared/helpers/translation-functions.ts';

export interface DatePickerPropsSchema extends DefaultProps {
	id: DatePickerProps['id'];
	wrapperClassName?: DatePickerProps['wrapperClassName'];
	calendarClassName?: DatePickerProps['calendarClassName'];
	popperClassName?: DatePickerProps['popperClassName'];
	showPopperArrow?: DatePickerProps['showPopperArrow'];
	showMonthDropdown?: DatePickerProps['showMonthDropdown'];
	showYearDropdown?: DatePickerProps['showYearDropdown'];
	dropdownMode?: DatePickerProps['dropdownMode'];
	calendarStartDay?: DatePickerProps['calendarStartDay'];
	dateFormat: DatePickerProps['dateFormat'];
	placeholderText?: DatePickerProps['placeholderText'];
	customInput: DatePickerProps['customInput'];
	popperPlacement?: DatePickerProps['popperPlacement'];
	locale: DatePickerProps['locale'];
	onChange?: (date: Date | null) => void;
	minDate?: Date;
	maxDate?: Date;
}

export function getDatePickerDefaultProps(id: string): DatePickerPropsSchema {
	return {
		id,
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
				id={`${id}__date-picker__input-field`}
				iconStart={<Icon name="calendar" />}
				ariaLabel={tText(
					'modules/content-page/components/date-picker/date-picker___datum-input-aria-label'
				)}
				value=""
			/>
		),
		popperPlacement: 'bottom-start',
		locale: { [Locale.Nl]: nlBE, [Locale.En]: enGB }[AdminConfigManager.getConfig().locale],
		minDate: undefined,
	};
}
