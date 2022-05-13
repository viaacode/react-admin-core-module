import { Table } from '@meemoo/react-components';
import clsx from 'clsx';
import { cloneDeep } from 'lodash-es';
import React, { FC, useState } from 'react';
import { TableOptions } from 'react-table';

import { Pagination } from '~modules/shared/components/Pagination/Pagination';

import { ENTRIES_PER_PAGE, KEY_VALUE_EDITOR_COLS } from './KeyValueEditor.const';
import { KeyValueEditorProps, KeyValuePair } from './KeyValueEditor.types';

/**
 * Shows a tabular view of the data and allows the user to edit the data
 */
export const KeyValueEditor: FC<KeyValueEditorProps> = ({
	className,
	data,
	filter = '',
	initialData,
	keyLabel = 'Id',
	keySeparator = '___',
	noDataForFilterMessage = 'Geen data die voldoet aan de filter',
	noDataMessage = 'Geen data',
	readonly = false,
	valueLabel = 'Waarde',
	onChange = () => null,
	onSort = () => null,
}) => {
	const [page, setPage] = useState(0);

	const getPaginatedData = (): [KeyValuePair[], number] => {
		const filteredItems = data.filter((row) => {
			const query = filter.toLowerCase();

			// If key or value contains the searched value, show the row
			if (row[0].toLowerCase().includes(query) || row[1].toLowerCase().includes(query)) {
				return true;
			}

			// If the initial row value contains the searched value, show the row
			const initialRow = initialData.find((initialRow) => initialRow[0] === row[0]);
			if (initialRow && initialRow[1].toLowerCase().includes(query)) {
				return true;
			}

			// Else, do not show the row
			return false;
		});

		// TODO: implement sort
		// const sortedItems = filteredItems.sort((rowA: [string, string], rowB: [string, string]) => {
		// 	if (rowA[sortColumn].toLowerCase() < rowB[sortColumn].toLowerCase()) {
		// 		return sortOrder === 'asc' ? 1 : -1;
		// 	}
		// 	if (rowA[sortColumn].toLowerCase() > rowB[sortColumn].toLowerCase()) {
		// 		return sortOrder === 'asc' ? -1 : 1;
		// 	}
		// 	return 0;
		// });

		return [
			filteredItems.slice(page * ENTRIES_PER_PAGE, (page + 1) * ENTRIES_PER_PAGE),
			filteredItems.length,
		];
	};

	const onValueChanged = (value: string, key: string) => {
		const modifiedData: KeyValuePair[] = cloneDeep(data);
		const row: [string, string] | undefined = modifiedData.find(
			(dataItem) => dataItem[0] === key
		);
		if (row) {
			row[1] = value;
			onChange(modifiedData);
		}
	};

	const [paginatedData] = getPaginatedData();

	const tableOptions = {
		data: paginatedData,
		columns: KEY_VALUE_EDITOR_COLS(
			keyLabel,
			valueLabel,
			readonly,
			keySeparator,
			onValueChanged
		),
		initialState: {
			pageSize: ENTRIES_PER_PAGE,
			// sortBy: sortFilters,
		},
	};

	return (
		<div className={clsx('c-key-value-editor', className)}>
			{!!paginatedData && !!paginatedData.length ? (
				<Table
					options={tableOptions as TableOptions<KeyValuePair>}
					onSortChange={onSort}
					// sortingIcons={sortingIcons}
					pagination={({ pageCount, gotoPage }) => {
						return (
							<Pagination
								showFirstLastNumbers
								onPageChange={(newPage) => {
									gotoPage(newPage);
									setPage(newPage);
								}}
								currentPage={page}
								pageCount={pageCount}
							/>
						);
					}}
				/>
			) : (
				<p>{filter ? noDataForFilterMessage : noDataMessage}</p>
			)}
		</div>
	);
};
