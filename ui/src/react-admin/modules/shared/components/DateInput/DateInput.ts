import * as ReactDatePicker from 'react-datepicker';

// Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.
// https://github.com/Hacker0x01/react-datepicker/issues/1333
// https://github.com/Hacker0x01/react-datepicker/issues/3834#issuecomment-1451662259
const DatePicker = (((ReactDatePicker.default as any).default as any) ||
	(ReactDatePicker.default as any) ||
	(ReactDatePicker as any)) as typeof ReactDatePicker.default;

export const DateInput = DatePicker;
