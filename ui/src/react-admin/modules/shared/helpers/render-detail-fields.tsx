import { compact, get, isBoolean, isNil, isString } from 'lodash-es';
import type { ReactElement, ReactNode } from 'react';
import React from 'react';
import Html from '~shared/components/Html/Html';
import { SanitizePreset } from '~shared/helpers/sanitize/presets';
import { formatDate } from './formatters/date';

export function renderDetailRow(
	value: ReactNode,
	label: string,
	shouldRender = true
): ReactElement | null {
	if (!shouldRender) {
		return null;
	}
	return (
		<tr key={`detail-row_${label}`}>
			<th>{label}</th>
			{isString(value) && <Html content={value} sanitizePreset={SanitizePreset.link} type="td" />}
			{!isString(value) && <td>{value}</td>}
		</tr>
	);
}

export function renderSimpleDetailRows<T>(
	obj: T,
	propAndTranslations: [keyof T, string][]
): ReactElement[] {
	return compact(
		propAndTranslations.map((propAndTranslation) => {
			let value = get(obj, propAndTranslation[0]);
			if (isBoolean(value)) {
				value = value ? 'Ja' : 'Nee';
			}
			return renderDetailRow(isNil(value) ? '-' : value, propAndTranslation[1]);
		})
	);
}

export function renderDateDetailRows<T>(
	obj: T,
	propAndTranslations: [keyof T, string][]
): ReactElement[] {
	return compact(
		propAndTranslations.map((propAndTranslation) => {
			const value = get(obj, propAndTranslation[0]);
			return renderDetailRow(value ? formatDate(value) : '-', propAndTranslation[1]);
		})
	);
}
