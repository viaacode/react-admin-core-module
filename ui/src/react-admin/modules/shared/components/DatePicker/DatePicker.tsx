import clsx from 'clsx';
import { format, isValid } from 'date-fns';
// https://github.com/Hacker0x01/react-datepicker/issues/1815#issuecomment-513215416
import nlBe from 'date-fns/locale/nl-BE/index.js';
import React, { FunctionComponent } from 'react';
import { ReactDatePickerProps, registerLocale, setDefaultLocale } from 'react-datepicker';
import { DefaultComponentProps } from '../../../..';
import { DateInput } from '../DateInput/DateInput';
import { Icon } from '../Icon';
import { noop } from 'lodash-es';

// import './DatePicker.scss';

registerLocale('nl', nlBe);
setDefaultLocale('nl');

export const getMaxDate = () => new Date(9999, 11, 31, 23, 59, 59); // https://meemoo.atlassian.net/browse/AVO-1828

export type DatePickerPropsSchema = DefaultComponentProps &
	Omit<ReactDatePickerProps, 'maxDate' | 'minDate' | 'value'> & {
		defaultTime?: string;
		maxDate?: Date;
		minDate?: Date;
		placeholder?: string;
		value?: Date | null;
	};

export const DatePicker: FunctionComponent<DatePickerPropsSchema> = ({
	className,
	defaultTime = '00:00',
	disabled = false,
	maxDate = getMaxDate(),
	onChange = noop,
	placeholder,
	showTimeInput = false,
	value,
	...props
}) => {
	const handleChangedDate = (newDate: Date) => {
		try {
			const newOutput = new Date(
				newDate.getFullYear(),
				newDate.getMonth(),
				newDate.getDate(),
				value?.getHours() ?? parseInt(defaultTime?.split(':')?.[0] || '0', 10),
				value?.getMinutes() ?? parseInt(defaultTime?.split(':')?.[1] || '0', 10)
			);
			if (isValid(newOutput)) {
				onChange(newOutput);
			}
		} catch (err) {
			// ignore invalid dates
		}
	};

	const handleChangedTime = (newTime: string) => {
		try {
			const newOutput = new Date(
				value?.getFullYear() ?? new Date().getFullYear(),
				value?.getMonth() ?? new Date().getMonth(),
				value?.getDate() ?? new Date().getDate(),
				parseInt(newTime?.split(':')?.[0] || '0', 10) ?? value?.getHours(),
				parseInt(newTime?.split(':')?.[1] || '0', 10) ?? value?.getMinutes()
			);
			if (isValid(newOutput)) {
				onChange(newOutput);
			}
		} catch (err) {
			// ignore invalid dates
		}
	};

	return (
		<div className={clsx(className, 'avo__c-datepicker')}>
			<div className={clsx('avo__c-datepicker--date c-input-with-icon-right')}>
				<DateInput
					className="c-input"
					selected={value}
					disabled={disabled}
					required={props.required}
					placeholderText={placeholder || 'dd/mm/yyyy'}
					onChange={handleChangedDate}
					dateFormat={'dd/MM/yyyy'}
					minDate={props.minDate}
					maxDate={
						// https://meemoo.atlassian.net/browse/AVO-1828
						getMaxDate().valueOf() <= new Date(maxDate).valueOf()
							? getMaxDate()
							: maxDate
					}
				/>
				<Icon name="calendar" />
			</div>
			{showTimeInput && (
				<div className="avo__c-datepicker--time">
					<input
						type="time"
						value={value ? format(value, 'HH:mm') : undefined}
						onChange={(evt) => handleChangedTime(evt.target.value)}
						className="c-input"
						placeholder="uu:mm"
						disabled={disabled}
					/>
				</div>
			)}
		</div>
	);
};
