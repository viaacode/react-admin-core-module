import { compact, isBoolean, isNil, isString } from 'es-toolkit';
import type { ReactElement, ReactNode } from 'react';
import React from 'react';
import Html from '~shared/components/Html/Html.js';
import { SanitizePreset } from '~shared/helpers/sanitize/presets/index.js';
import { formatDate } from './formatters/date.js';

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
			let value = obj?.[propAndTranslation[0]];
			if (isBoolean(value)) {
				// biome-ignore lint/suspicious/noExplicitAny: TODO figure out why typings complain here
				value = (value ? 'Ja' : 'Nee') as any;
			}
			return renderDetailRow((isNil(value) ? '-' : value) as ReactNode, propAndTranslation[1]);
		})
	);
}

export function renderDateDetailRows<T>(
	obj: T,
	propAndTranslations: [keyof T, string][]
): ReactElement[] {
	return compact(
		propAndTranslations.map((propAndTranslation) => {
			const value = obj?.[propAndTranslation[0]];
			// biome-ignore lint/suspicious/noExplicitAny: this should probably be solved with generics, but any is easier for now
			return renderDetailRow(value ? formatDate(value as any) : '-', propAndTranslation[1]);
		})
	);
}
