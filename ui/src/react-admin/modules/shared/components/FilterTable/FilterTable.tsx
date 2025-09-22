import { type OrderDirection, PaginationBar } from '@meemoo/react-components';
import { useLocalStorage } from '@uidotdev/usehooks';
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
import type { Avo } from '@viaa/avo2-types';
import clsx from 'clsx';
import { cloneDeep, compact, get, sortBy } from 'lodash-es';
import React, {
	type FunctionComponent,
	type KeyboardEvent,
	type ReactElement,
	type ReactNode,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { useQueryParams } from 'use-query-params';
import { isAvo } from '~modules/shared/helpers/is-avo';
import { CenteredSpinner } from '~shared/components/Spinner/CenteredSpinner';

import { tHtml, tText } from '~shared/helpers/translation-functions';
import type { TableFilterType } from '~shared/types/table-filter-types';

import { KeyCode } from '../../consts/keycode';
import { eduOrgToClientOrg } from '../../helpers/edu-org-string-to-client-org';
import './FilterTable.scss';
import { ErrorView } from '~shared/components/error';
import { GET_DEFAULT_PAGINATION_BAR_PROPS } from '~shared/components/PaginationBar/PaginationBar.consts';
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
import { FILTER_TABLE_QUERY_PARAM_CONFIG } from './FilterTable.const';
import { cleanupFilterTableState } from './FilterTable.utils';

export interface FilterableTableState {
	query?: string;
	sort_column: string;
	sort_order: Avo.Search.OrderDirection;
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
	defaultOrderDirection?: OrderDirection;
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
	hideTableColumnsButton?: boolean;
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
	const [tableState, setTableState] = useQueryParams(FILTER_TABLE_QUERY_PARAM_CONFIG(columns));

	const {
		data: preferredColumns,
		isLoading: isLoadingColumnPreferences,
		refetch: reloadPreferredColumns,
	} = useGetTableColumnPreference(location.pathname);
	const { mutateAsync: setPreferredColumns } = useUpdateTableColumnPreference(location.pathname);

	// biome-ignore lint/suspicious/noExplicitAny: todo
	const handleTableStateChanged = useCallback(
		(value: any, id: string) => {
			// biome-ignore lint/suspicious/noExplicitAny: todo
			let newTableState: any = cloneDeep(tableState);

			newTableState = cleanupFilterTableState({
				...newTableState,
				[id]: value,
				...(id !== 'page' ? { page: 0 } : {}), // Reset the page to 0, when any filter or sort order change is made
			});

			setTableState(newTableState, 'replace');
		},
		[setTableState, tableState]
	);

	const handleSortOrderChanged = (columnId: string) => {
		// biome-ignore lint/suspicious/noExplicitAny: todo
		let newTableState: any = cloneDeep(tableState);

		newTableState = cleanupFilterTableState({
			...newTableState,
			page: 0,
			sort_column: columnId,
			sort_order: toggleSortOrder(tableState.sort_order),
		});

		setTableState(newTableState, 'replace');
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
		return sortBy(
			columns.map((column) => ({
				id: column.id,
				label: column.label || column.tooltip || '',
				checked: tableState.columns?.length
					? tableState.columns.includes(column.id)
					: column.visibleByDefault,
			})),
			(option) => option.label
		);
	};

	const getSelectedColumns = (): FilterableColumn[] => {
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

	const updateSelectedColumns = (selectedColumns: string[]) => {
		// Order the selected columns from the modal according to the default order in the column const array
		// This way, when a user selects columns, they will be in the default order
		// But if an array is set by modifying the query params, then the order from the query params will be kept
		setPreferredColumns(
			columns.filter((column) => selectedColumns.includes(column.id)).map((column) => column.id)
		).then(() => reloadPreferredColumns());
	};

	useEffect(() => {
		handleTableStateChanged(preferredColumns, 'columns');
	}, [handleTableStateChanged, preferredColumns]);

	useEffect(() => {
		onTableStateChanged(tableState);
		setSearchTerm(tableState.query || '');
	}, [onTableStateChanged, tableState]);

	const renderFilters = () => {
		const page = tableState.page || 0;
		const from = page * itemsPerPage + 1;
		const to = Math.min(page * itemsPerPage + itemsPerPage, dataCount);
		const hasFilters = columns.some((col) => col.filterType);
		const showLeftFilters = hasFilters || !!bulkActions;
		const showRightColumns = isAvo() && showColumnsVisibility;
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
															options={get(col, 'filterProps.options', []).map(
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
															trueLabel={get(col, 'filterProps.trueLabel')}
															falseLabel={get(col, 'filterProps.falseLabel')}
															includeEmpty={get(col, 'filterProps.includeEmpty')}
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
		/>
	);

	return (
		<div className={clsx('c-filter-table', className)}>
			{!data.length && !getFilters(tableState) ? (
				renderNoResults()
			) : (
				<>
					{renderFilters()}
					<div className="c-filter-table__loading-wrapper">
						<div style={{ opacity: isLoading || isLoadingColumnPreferences ? 0.2 : 1 }}>
							<Table
								columns={getSelectedColumns()}
								data={data}
								emptyStateMessage={!isError ? (noContentMatchingFiltersMessage as string) : ''}
								onColumnClick={(columnId) => {
									handleSortOrderChanged(columnId);
								}}
								onRowClick={onRowClick}
								renderCell={renderCell}
								rowKey={rowKey}
								variant={variant}
								sortColumn={tableState.sort_column || defaultOrderProp || undefined}
								sortOrder={
									((tableState.sort_order as Avo.Search.OrderDirection) ||
										defaultOrderDirection ||
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
										startItem={(tableState.page || 0) * itemsPerPage}
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
						{(isLoading || isLoadingColumnPreferences) && <CenteredSpinner />}
					</div>
				</>
			)}
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
					confirmLabel={get(
						bulkActions.find((action) => action.value === selectedBulkAction),
						'label',
						tText('admin/shared/components/filter-table/filter-table___bevestig')
					)}
					confirmButtonType={get(
						bulkActions.find((action) => action.value === selectedBulkAction),
						'confirmButtonType'
					)}
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
