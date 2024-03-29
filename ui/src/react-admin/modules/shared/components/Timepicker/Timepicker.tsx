import clsx from 'clsx';
import React, { FC } from 'react';
import { DateInput } from '~shared/components/DateInput/DateInput';

import { TimepickerProps } from './Timepicker.types';

const Timepicker: FC<TimepickerProps> = (props) => {
	const { className } = props;

	const classNames = clsx(className, 'c-datepicker', 'c-datepicker--time');

	return (
		<DateInput
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

export default Timepicker;
