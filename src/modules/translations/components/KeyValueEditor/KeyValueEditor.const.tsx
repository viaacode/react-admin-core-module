import { TextArea } from '@meemoo/react-components';
import React from 'react';
import { Column } from 'react-table';

import { KeyValuePair } from './KeyValueEditor.types';

export const KEY_VALUE_EDITOR_COLS = (
	keyHeader: string,
	valueHeader: string,
	readonly: boolean,
	keySeparator: string,
	onChange: (newValue: string, key: string) => void
): Column<KeyValuePair>[] => {
	return [
		{
			id: 'key',
			Header: keyHeader,
			Cell: (props: any) => {
				console.log(props);

				const keyParts = props.key.split(keySeparator);
				// const keyParts = ['', ''];

				return (
					<div>
						<div className="c-keyvalue-label c-keyvalue-path">{keyParts[0]}</div>
						{!!keyParts[1] && (
							<div className="c-keyvalue-label c-keyvalue-translaton">
								{keyParts[1]}
							</div>
						)}
					</div>
				);
			},
		},
		{
			id: 'value',
			Header: valueHeader,
			Cell: () => {
				const key = '';
				const value = '';
				if (readonly) {
					return <span className="c-keyvalue-label">{value}</span>;
				}

				return (
					<TextArea
						autoHeight
						value={value}
						onChange={(e) => onChange(e.target.value, key)}
					/>
				);
			},
		},
	];
};

export const ENTRIES_PER_PAGE = 20;
