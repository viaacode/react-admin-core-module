import { isArray } from 'lodash-es';

import type { DateRange } from '../components/DateRangeDropdown/DateRangeDropdown';

export const DateRangeParam = {
	encode: (value: DateRange | undefined) => {
		if (!value) {
			return;
		}
		return JSON.stringify(value);
	},
	decode: (value: string | (string | null)[] | null | undefined): DateRange | undefined => {
		try {
			if (Array.isArray(value)) {
				if (value.length) {
					return JSON.parse(value[0] as string);
				}
				return;
			}
			if (!value) {
				return;
			}
			return JSON.parse(value);
		} catch (_err) {
			return;
		}
	},
};

export const CheckboxListParam = {
	encode: (value: string[] | undefined) => {
		if (!value) {
			return;
		}
		return value.join('~');
	},
	decode: (value: string | (string | null)[] | null | undefined): string[] | undefined => {
		try {
			if (!value) {
				return [];
			}
			if (isArray(value)) {
				return value as string[];
			}
			const newValues = value.split('~');
			return newValues?.length ? newValues : undefined;
		} catch (_err) {
			return;
		}
	},
};
