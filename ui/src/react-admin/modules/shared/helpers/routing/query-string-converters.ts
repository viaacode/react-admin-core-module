import { isNil } from 'es-toolkit';
import type { DateRange } from '../../components/DateRangeDropdown/DateRangeDropdown';

export interface QueryParamEncoderDecoder<T> {
	encode: (value: T | undefined) => string | undefined;
	decode: (value: string | undefined) => T | undefined;
}

export const NumberParam: QueryParamEncoderDecoder<number> = {
	encode: (value: number | undefined): string | undefined => {
		if (isNil(value)) {
			return undefined;
		}
		return value.toString();
	},
	decode: (value: string | undefined): number | undefined => {
		if (isNil(value)) {
			return undefined;
		}
		const parsed = parseInt(value);
		return Number.isNaN(parsed) ? undefined : parsed;
	},
};

export const StringParam: QueryParamEncoderDecoder<string> = {
	encode: (value: string | undefined) => {
		if (value === undefined) {
			return;
		}
		return value;
	},
	decode: (value: string | undefined): string | undefined => {
		if (!value) {
			return undefined;
		}
		return value;
	},
};

export const DateRangeParam: QueryParamEncoderDecoder<DateRange> = {
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

export const CheckboxListParam: QueryParamEncoderDecoder<string[]> = {
	encode: (value: string[] | undefined): string | undefined => {
		if (!value) {
			return undefined;
		}
		return value.join('~');
	},
	decode: (value: string | (string | null)[] | null | undefined): string[] | undefined => {
		try {
			if (!value) {
				return undefined;
			}
			if (Array.isArray(value)) {
				if (value.length) {
					return value as string[];
				} else {
					return undefined;
				}
			}
			const newValues = value.split('~');
			return newValues?.length ? newValues : undefined;
		} catch (_err) {
			return undefined;
		}
	},
};
