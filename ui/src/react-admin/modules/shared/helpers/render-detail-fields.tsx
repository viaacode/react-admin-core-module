import { get, isBoolean, isNil, isString } from 'lodash-es';
import React, { ReactElement, ReactNode } from 'react';
import { SanitizePreset } from '~shared/helpers/sanitize/presets';

import { formatDate } from './formatters/date';
import { sanitizeHtml } from './sanitize';

export function renderDetailRow(value: ReactNode, label: string): ReactElement {
	return (
		<tr key={`detail-row_${label}`}>
			<th>{label}</th>
			{isString(value) && (
				<td
					dangerouslySetInnerHTML={{ __html: sanitizeHtml(value, SanitizePreset.link) }}
				/>
			)}
			{!isString(value) && <td>{value}</td>}
		</tr>
	);
}

export function renderSimpleDetailRows<T>(
	obj: T,
	propAndTranslations: [keyof T, string][]
): ReactElement[] {
	return propAndTranslations.map((propAndTranslation) => {
		let value = get(obj, propAndTranslation[0]);
		if (isBoolean(value)) {
			value = value ? 'Ja' : 'Nee';
		}
		return renderDetailRow(isNil(value) ? '-' : value, propAndTranslation[1]);
	});
}

export function renderDateDetailRows<T>(
	obj: T,
	propAndTranslations: [keyof T, string][]
): ReactElement[] {
	return propAndTranslations.map((propAndTranslation) => {
		const value = get(obj, propAndTranslation[0]);
		return renderDetailRow(value ? formatDate(value) : '-', propAndTranslation[1]);
	});
}
