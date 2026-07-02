import { TextInput } from '@meemoo/react-components';
import { nlBE } from 'date-fns/locale';
import { Icon } from '~shared/components/Icon/Icon';
import type { TimepickerProps } from './Timepicker.types.ts';

export function getTimePickerDefaults(id: string, ariaLabel: string): TimepickerProps {
	return {
		id: id,
		dateFormat: 'HH:mm',
		showTimeSelect: true,
		showTimeSelectOnly: true,
		timeIntervals: 15,
		autoComplete: 'off', // html prop
		customInput: (
			<TextInput
				iconStart={<Icon name="clock" />}
				ariaLabel={ariaLabel}
				value=""
				id={`${id}__time-picker__input`}
			/>
		),
		locale: nlBE,
	};
}
