import clsx from 'clsx';
import type { FC } from 'react';
import React from 'react';
import DatePicker from 'react-datepicker';
import { getDatePickerDefaultProps } from '~modules/content-page/components/DatePicker/DatePicker.consts';
import type { TimepickerProps } from './Timepicker.types';

export const Timepicker: FC<TimepickerProps> = (props) => {
	const { className } = props;

	const classNames = clsx(className, 'c-datepicker', 'c-datepicker--time');

	const defaultProps = getDatePickerDefaultProps(props.id);
	return (
		<DatePicker
			locale={defaultProps.locale}
			wrapperClassName={classNames}
			calendarClassName={classNames}
			popperClassName={classNames}
			showPopperArrow={false}
			showMonthDropdown
			showYearDropdown
			showTimeInput
			showTimeSelectOnly
			dropdownMode="select"
			timeFormat="HH:mm"
			{...props}
		/>
	);
};
