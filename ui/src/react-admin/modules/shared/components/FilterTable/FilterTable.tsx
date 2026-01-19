import { PaginationBar } from '@meemoo/react-components';
import {
	Button,
	type ButtonType,
	Flex,
	Form,
	FormGroup,
	IconName,
	Select,
	type SelectOption,
	Spacer,
	Table,
	type TableColumn,
	TextInput,
	Toolbar,
	ToolbarLeft,
	ToolbarRight,
} from '@viaa/avo2-components';

import clsx from 'clsx';
import { compact, isNil, sortBy } from 'es-toolkit';
import React, {
	type FunctionComponent,
	type KeyboardEvent,
	type ReactElement,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { CenteredSpinner } from '~shared/components/Spinner/CenteredSpinner';

import { tHtml, tText } from '~shared/helpers/translation-functions';
import type { TableFilterType } from '~shared/types/table-filter-types';

import { KeyCode } from '../../consts/keycode';
import { eduOrgToClientOrg } from '../../helpers/edu-org-string-to-client-org';
import './FilterTable.scss';
import type { AvoSearchOrderDirection } from '@viaa/avo2-types';
import { ErrorView } from '~shared/components/error/ErrorView';
import { GET_FILTER_TABLE_QUERY_PARAM_CONFIG } from '~shared/components/FilterTable/FilterTable.const';
import { GET_DEFAULT_PAGINATION_BAR_PROPS } from '~shared/components/PaginationBar/PaginationBar.consts';
import { isHetArchief } from '~shared/helpers/is-hetarchief.ts';
import { navigateFunc } from '~shared/helpers/navigate-fnc';
import { isServerSideRendering } from '~shared/helpers/routing/is-server-side-rendering.ts';
import { toggleSortOrder } from '~shared/helpers/toggle-sort-order';
import { useGetTableColumnPreference } from '~shared/hooks/useGetTableColumnPreference';
import { useUpdateTableColumnPreference } from '~shared/hooks/useUpdateTableColumnPreference';
import BooleanCheckboxDropdown from '../BooleanCheckboxDropdown/BooleanCheckboxDropdown';
import type { CheckboxOption } from '../CheckboxDropdownModal/CheckboxDropdownModal';
import { CheckboxDropdownModal } from '../CheckboxDropdownModal/CheckboxDropdownModal';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import DateRangeDropdown from '../DateRangeDropdown/DateRangeDropdown';
import { MultiEducationalOrganisationSelectModal } from '../MultiEducationalOrganisationSelectModal/MultiEducationalOrganisationSelectModal';
import { MultiUserSelectDropdown } from '../MultiUserSelectDropdown/MultiUserSelectDropdown';
import { cleanupFilterTableState } from './FilterTable.utils';

export interface FilterableTableState {
	query?: string;
	sort_column: string;
	sort_order: AvoSearchOrderDirection;
	page: number;
}

export interface FilterableColumn<T = string> extends Omit<TableColumn, 'id'> {
	filterType?: TableFilterType;
	// biome-ignore lint/suspicious/noExplicitAny: todo
	filterProps?: any;
	visibleByDefault: boolean;
	id: T;
}

interface FilterTableProps {
	// biome-ignore lint/suspicious/noExplicitAny: todo
	data: any[];
	dataCount: number;
	itemsPerPage: number;
	columns: FilterableColumn[];
	searchTextPlaceholder: string;
	noContentMatchingFiltersMessage: string | ReactNode;
	errorMessage?: string | ReactNode;
	renderNoResults: () => ReactElement;
	renderCell: (
		// biome-ignore lint/suspicious/noExplicitAny: todo
		rowData: any,
		columnId: string,
		rowIndex: number,
		columnIndex: number
	) => ReactNode;
	className?: string;
	// biome-ignore lint/suspicious/noExplicitAny: todo
	onTableStateChanged: (tableState: { [id: string]: any }) => void;
	// biome-ignore lint/suspicious/noExplicitAny: todo
	onRowClick?: (rowData: any) => void;
	// biome-ignore lint/suspicious/noExplicitAny: todo
	rowKey?: string | ((row: any) => string);
	variant?: 'bordered' | 'invisible' | 'styled';
	isLoading?: boolean;
	isError?: boolean;
	defaultOrderProp?: string;
	defaultOrderDirection?: AvoSearchOrderDirection;
	showPagination?: boolean;
	showColumnsVisibility?: boolean;

	// Used for automatic dropdown with bulk actions
	bulkActions?: (SelectOption<string> & {
		confirm?: boolean;
		confirmButtonType?: ButtonType;
	})[];
	onSelectBulkAction?: (action: string) => void;

	// Used for manual handling of selected rows
	showCheckboxes?: boolean;
	selectedItemIds?: (string | number)[] | null;
	onSelectionChanged?: (selectedItemIds: (string | number)[]) => void;
	onSelectAll?: () => void;
	searchInputAriaLabel?: string;
}

export const FilterTable: FunctionComponent<FilterTableProps> = ({
	data,
	dataCount,
	itemsPerPage,
	columns,
	searchTextPlaceholder,
	noContentMatchingFiltersMessage,
	errorMessage,
	renderNoResults,
	renderCell,
	className,
	onTableStateChanged,
	onRowClick,
	rowKey = 'id',
	variant = 'bordered',
	isLoading = false,
	isError = false,
	showPagination = true,
	bulkActions,
	onSelectBulkAction,
	showCheckboxes = false,
	showColumnsVisibility = true,
	selectedItemIds,
	onSelectionChanged,
	onSelectAll,
	searchInputAriaLabel,
	defaultOrderProp,
	defaultOrderDirection,
}) => {
	// Holds the text while the user is typing, once they press the search button or enter it will be copied to the tableState.query
	// This avoids doing a database query on every key press
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [selectedBulkAction, setSelectedBulkAction] = useState<string | null>(null);
	const [confirmBulkActionModalOpen, setConfirmBulkActionModalOpen] = useState<boolean>(false);
	const queryParamsConfig = useMemo(() => GET_FILTER_TABLE_QUERY_PARAM_CONFIG(columns), [columns]);

	// Fetch column preferences from the database for this route and user
	const { data: preferredColumns, isLoading: isLoadingColumnPreferences } =
		useGetTableColumnPreference(location.pathname);
	const { mutateAsync: setPreferredColumns } = useUpdateTableColumnPreference(location.pathname);

	/**
	 * Sort column ids according to the default order in the column config array of the filterTable
	 * @param columnIds
	 */
	const sortColumns = useCallback(
		(columnIds: string[]) => {
			// Order the selected columns from the modal according to the default order in the column const array
			// This way, when a user selects columns, they will be in the default order
			// But if an array is set by modifying the query params, then the order from the query params will be kept
			return columns.filter((column) => columnIds.includes(column.id)).map((column) => column.id);
		},
		[columns]
	);

	// biome-ignore lint/suspicious/noExplicitAny: many possible options to list here
	const getTableState = useCallback((): Record<string, any> => {
		if (isServerSideRendering()) {
			return {};
		}
		// biome-ignore lint/suspicious/noExplicitAny: many possible options to list here
		const tableState: Record<string, any> = {};
		for (const queryParamKey in queryParamsConfig) {
			const queryParamValueRaw = new URLSearchParams(location.search).get(queryParamKey);
			const queryParamEncoderDecoder = queryParamsConfig[queryParamKey];
			const queryParamValue = queryParamEncoderDecoder.decode(queryParamValueRaw || undefined);
			if (!isNil(queryParamValue)) {
				tableState[queryParamKey] = queryParamValue;
			}
		}
		if (!tableState.columns && preferredColumns && preferredColumns.length > 0) {
			tableState.columns = sortColumns(preferredColumns);
		}
		return tableState;
	}, [queryParamsConfig, preferredColumns, sortColumns]);
	const setTableState = useCallback(
		// biome-ignore lint/suspicious/noExplicitAny: many possible options to list here
		async (newTableState: Record<string, any>) => {
			const url = new URL(window.location.href);
			for (const queryParamKey in queryParamsConfig) {
				const queryParamValue = newTableState[queryParamKey];
				const queryParamValueEncoded = queryParamsConfig[queryParamKey].encode(queryParamValue);
				if (isNil(queryParamValueEncoded)) {
					url.searchParams.delete(queryParamKey);
				} else {
					url.searchParams.set(queryParamKey, queryParamValueEncoded || '');
				}
			}
			if (window.location.href === url.href) {
				// If the url wouldn't change, don't update it to prevent an infinite loop
				return;
			}
			await navigateFunc(`${url.pathname}?${url.searchParams.toString()}`, { replace: true });
			onTableStateChanged(newTableState);
		},
		[queryParamsConfig, onTableStateChanged]
	);

	const handleTableStateChanged = useCallback(
		// biome-ignore lint/suspicious/noExplicitAny: TODO fix
		(value: any, id: string) => {
			// biome-ignore lint/suspicious/noExplicitAny: todo
			const newTableState: any = cleanupFilterTableState({
				[id]: value,
				...(id !== 'page' ? { page: 0 } : {}), // Reset the page to 0, when any filter or sort order change is made
			});

			setTableState(newTableState);
		},
		[setTableState]
	);

	const handleSortOrderChanged = (columnId: string) => {
		// biome-ignore lint/suspicious/noExplicitAny: todo
		let newTableState: any = getTableState();

		newTableState = cleanupFilterTableState({
			...newTableState,
			page: 0,
			sort_column: columnId,
			sort_order: toggleSortOrder(newTableState.sort_order),
		});

		setTableState(newTableState);
	};

	const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.keyCode === KeyCode.Enter) {
			handleTableStateChanged(searchTerm, 'query');
		}
	};

	const handleSelectBulkAction = (selectedAction: string) => {
		const bulkActionInfo = (bulkActions || []).find((action) => action.value === selectedAction);

		if (bulkActionInfo && onSelectBulkAction) {
			if (bulkActionInfo.confirm) {
				setSelectedBulkAction(selectedAction);
				setConfirmBulkActionModalOpen(true);
			} else {
				onSelectBulkAction(selectedAction);
				setSelectedBulkAction(null);
			}
		}
	};

	const handleConfirmSelectBulkAction = () => {
		setConfirmBulkActionModalOpen(false);
		if (onSelectBulkAction && selectedBulkAction) {
			onSelectBulkAction(selectedBulkAction);
			setSelectedBulkAction(null);
		}
	};

	const getColumnOptions = (): CheckboxOption[] => {
		// Get columns from query string list of columns, or use columns visible by default
		const tableState = getTableState();
		return sortBy(
			columns.map((column) => ({
				id: column.id,
				label: column.label || column.tooltip || '',
				checked: tableState.columns?.length
					? tableState.columns.includes(column.id)
					: column.visibleByDefault,
			})),
			['label']
		);
	};

	const getSelectedColumns = (): FilterableColumn[] => {
		const tableState = getTableState();
		if (!!tableState.columns && !!tableState.columns.length) {
			// Return the columns in the order they are specified in the query params
			return compact(
				tableState.columns.map((columnId: string) => {
					return columns.find((column) => column.id === columnId);
				})
			);
		}

		return columns.filter((column) => column.visibleByDefault);
	};

	const updateSelectedColumns = async (selectedColumns: string[]) => {
		const orderedSelectedColumns = sortColumns(selectedColumns);
		handleTableStateChanged(orderedSelectedColumns, 'columns');
		await setPreferredColumns(orderedSelectedColumns);
	};

	const renderFilters = () => {
		const tableState = getTableState();
		const page = tableState.page || 0;
		const from = page * itemsPerPage + 1;
		const to = Math.min(page * itemsPerPage + itemsPerPage, dataCount);
		const hasFilters = columns.some((col) => col.filterType);
		const showLeftFilters = hasFilters || !!bulkActions;
		const showRightColumns = showColumnsVisibility;
		const showToolbar = showLeftFilters || showRightColumns;

		return (
			<>
				<Spacer margin="bottom">
					<Form type="inline">
						<FormGroup className="c-content-filters__search" inlineMode="grow">
							<TextInput
								placeholder={searchTextPlaceholder}
								icon={IconName.search}
								onChange={setSearchTerm}
								onKeyUp={handleKeyUp}
								value={searchTerm}
								ariaLabel={searchInputAriaLabel}
							/>
						</FormGroup>
						<FormGroup inlineMode="shrink">
							<Button
								label={tText('admin/shared/components/filter-table/filter-table___zoeken')}
								type="primary"
								onClick={() => handleTableStateChanged(searchTerm, 'query')}
							/>
						</FormGroup>
						<Spacer margin="left-small">
							<p className="c-body-1 u-text-muted">
								{from}-{to} van {dataCount} resultaten
							</p>
						</Spacer>
					</Form>
				</Spacer>

				{showToolbar && (
					<Spacer margin="bottom">
						<Toolbar className="c-filter-table__toolbar">
							{showLeftFilters && (
								<ToolbarLeft>
									<Flex spaced="regular" wrap>
										{columns.map((col) => {
											if (!col.filterType || !col.id) {
												return null;
											}

											switch (col.filterType) {
												case 'CheckboxDropdownModal':
													return (
														<CheckboxDropdownModal
															{...(col.filterProps || {})}
															id={col.id}
															label={col.label}
															onChange={(value) => handleTableStateChanged(value, col.id)}
															options={(col?.filterProps?.options || []).map(
																(option: CheckboxOption) => ({
																	...option,
																	checked:
																		// biome-ignore lint/suspicious/noExplicitAny: todo
																		((tableState as any)[col.id] || []).includes(option.id),
																})
															)}
															key={`filter-${col.id}`}
														/>
													);

												case 'DateRangeDropdown':
													return (
														<DateRangeDropdown
															{...(col.filterProps || {})}
															id={col.id}
															label={col.label}
															onChange={(value) => handleTableStateChanged(value, col.id)}
															// biome-ignore lint/suspicious/noExplicitAny: todo
															range={(tableState as any)[col.id]}
															key={`filter-${col.id}`}
														/>
													);

												case 'BooleanCheckboxDropdown':
													return (
														<BooleanCheckboxDropdown
															{...(col.filterProps || {})}
															id={col.id}
															label={col.label}
															// biome-ignore lint/suspicious/noExplicitAny: todo
															value={(tableState as any)[col.id]}
															onChange={(value) => handleTableStateChanged(value, col.id)}
															trueLabel={col?.filterProps?.trueLabel}
															falseLabel={col?.filterProps?.falseLabel}
															includeEmpty={col?.filterProps?.includeEmpty}
															key={`filter-${col.id}`}
															searchInputAriaLabel={tText(
																'modules/shared/components/filter-table/filter-table___zoekveld-checkbox-filter-aria-label'
															)}
														/>
													);

												case 'MultiUserSelectDropdown':
													return (
														<MultiUserSelectDropdown
															{...(col.filterProps || {})}
															id={col.id}
															label={col.label}
															// biome-ignore lint/suspicious/noExplicitAny: todo
															values={(tableState as any)[col.id]}
															// biome-ignore lint/suspicious/noExplicitAny: todo
															onChange={(value: any) => handleTableStateChanged(value, col.id)}
															key={`filter-${col.id}`}
														/>
													);

												case 'MultiEducationalOrganisationSelectModal':
													return (
														<MultiEducationalOrganisationSelectModal
															{...(col.filterProps || {})}
															id={col.id}
															label={col.label || ''}
															values={eduOrgToClientOrg(
																// biome-ignore lint/suspicious/noExplicitAny: todo
																(tableState as any)[col.id]
															)}
															onChange={(value) => handleTableStateChanged(value, col.id)}
															key={`filter-${col.id}`}
														/>
													);

												default:
													return null;
											}
										})}
										{!!bulkActions?.length && (
											<Select
												options={bulkActions}
												onChange={handleSelectBulkAction}
												placeholder={tText(
													'admin/shared/components/filter-table/filter-table___bulkactie'
												)}
												disabled={!bulkActions.find((action) => !action.disabled)}
												className="c-bulk-action-select"
											/>
										)}
									</Flex>
								</ToolbarLeft>
							)}
							{showRightColumns && (
								<ToolbarRight>
									<CheckboxDropdownModal
										label={tText('admin/shared/components/filter-table/filter-table___kolommen')}
										id="table_columns"
										options={getColumnOptions()}
										onChange={updateSelectedColumns}
										showSelectedValuesOnCollapsed={false}
										showSearch={false}
									/>
								</ToolbarRight>
							)}
						</Toolbar>
					</Spacer>
				)}
			</>
		);
	};

	const renderError = () => (
		<ErrorView
			message={
				errorMessage ||
				tHtml(
					'modules/shared/components/filter-table/filter-table___er-is-iets-mis-gegaan-bij-het-laden-van-de-gegevens'
				)
			}
			icon={IconName.alertTriangle}
			actionButtons={['home']}
			locationId="filter-table__error"
		/>
	);

	return (
		<div className={clsx('c-filter-table', className)}>
			{renderFilters()}
			<div className="c-filter-table__loading-wrapper">
				<div style={{ opacity: isLoading || isLoadingColumnPreferences ? 0.2 : 1 }}>
					<Table
						columns={getSelectedColumns()}
						data={data}
						isLoading={isLoading}
						emptyStateMessage={!isError ? (noContentMatchingFiltersMessage as string) : ''}
						onColumnClick={(columnId) => {
							handleSortOrderChanged(columnId);
						}}
						enableRowFocusOnClick={isHetArchief()}
						onRowClick={onRowClick}
						renderCell={renderCell}
						rowKey={rowKey}
						variant={variant}
						sortColumn={getTableState().sort_column || defaultOrderProp || undefined}
						sortOrder={
							((getTableState().sort_order as AvoSearchOrderDirection) ||
								defaultOrderDirection ||
								// biome-ignore lint/suspicious/noExplicitAny: TODO fix
								undefined) as any // TODO add asc_nulls_first to table sort orders
						}
						showCheckboxes={(!!bulkActions && !!bulkActions.length) || showCheckboxes}
						selectedItemIds={selectedItemIds || undefined}
						onSelectionChanged={onSelectionChanged}
						onSelectAll={onSelectAll}
					/>
					{isError && renderError()}
					{showPagination && (
						<Spacer margin="top-large">
							<PaginationBar
								{...GET_DEFAULT_PAGINATION_BAR_PROPS()}
								startItem={(getTableState().page || 0) * itemsPerPage}
								itemsPerPage={itemsPerPage}
								totalItems={dataCount}
								onPageChange={(newPage: number) => handleTableStateChanged(newPage, 'page')}
								onScrollToTop={() => {
									const filterTable = document.querySelector('.c-filter-table');
									const scrollable = filterTable?.closest('.c-scrollable');
									scrollable?.scrollTo(0, 0);
									window?.scrollTo(0, 0);
								}}
							/>
						</Spacer>
					)}
				</div>
				{(isLoading || isLoadingColumnPreferences) && (
					<CenteredSpinner locationId="filter-table--loading" />
				)}
			</div>
			{!!bulkActions && !!bulkActions.length && (
				<ConfirmModal
					title={tText(
						'admin/shared/components/filter-table/filter-table___ben-je-zeker-dat-je-deze-actie-wil-uitvoeren'
					)}
					body={tHtml(
						'admin/shared/components/filter-table/filter-table___opgelet-deze-actie-kan-niet-meer-ongedaan-worden'
					)}
					isOpen={confirmBulkActionModalOpen}
					deleteObjectCallback={handleConfirmSelectBulkAction}
					onClose={() => setConfirmBulkActionModalOpen(false)}
					confirmLabel={
						bulkActions.find((action) => action.value === selectedBulkAction)?.label ||
						tText('admin/shared/components/filter-table/filter-table___bevestig')
					}
					confirmButtonType={
						bulkActions.find((action) => action.value === selectedBulkAction)?.confirmButtonType
					}
				/>
			)}
		</div>
	);
};

export default FilterTable;

// biome-ignore lint/suspicious/noExplicitAny: todo
export function getFilters(tableState: any | undefined | null): any {
	if (!tableState) {
		return tableState;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	// biome-ignore lint/correctness/noUnusedVariables: unused only because we want to remove these from the filters by destructuring
	const { page, sort_column, sort_order, ...filters } = tableState;

	return cleanupFilterTableState(filters);
}
