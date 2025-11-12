import ReactDatePicker from 'react-datepicker';

// Re-exporting to fix typing issue between commonJS library and ESM project
export const DateInput = ReactDatePicker as unknown as typeof ReactDatePicker.default;
