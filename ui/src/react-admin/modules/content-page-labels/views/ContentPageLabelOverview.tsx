import { Button } from '@meemoo/react-components';
import { ButtonToolbar } from '@viaa/avo2-components';
import { get, isNil } from 'lodash-es';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';

import { AdminConfigManager, ToastType } from '~core/config';
import { ContentPageLabelService } from '~modules/content-page-labels/content-page-label.service';
import { ITEMS_PER_PAGE } from '~modules/item/items.consts';
import { ErrorView } from '~modules/shared/components/error';
import { Link } from '~modules/shared/components/Link';
import { Icon } from '~shared/components';
import {
	CheckboxDropdownModalProps,
	CheckboxOption,
} from '~shared/components/CheckboxDropdownModal/CheckboxDropdownModal';
import ConfirmModal from '~shared/components/ConfirmModal/ConfirmModal';

import { GET_CONTENT_TYPE_LABELS } from '~shared/components/ContentPicker/ContentPicker.const';
import {
	LoadingErrorLoadedComponent,
	LoadingInfo,
} from '~shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import SmartLink from '~shared/components/SmartLink/SmartLink';
import {
	getDateRangeFilters,
	getMultiOptionFilters,
	getQueryFilter,
} from '~shared/helpers/filters';
import { formatDate } from '~shared/helpers/formatters/date';
import { buildLink, navigate } from '~shared/helpers/link';
import { truncateTableValue } from '~shared/helpers/truncate';
import { AdminLayout } from '~shared/layouts';
import { TableColumnDataType } from '~shared/types/table-column-data-type';

import { useContentTypes } from '../../content-page/hooks/useContentTypes';
import FilterTable, {
	FilterableColumn,
	getFilters,
} from '../../shared/components/FilterTable/FilterTable';
import {
	ContentPageLabel,
	ContentPageLabelOverviewTableCols,
	ContentPageLabelTableState,
} from '../content-page-label.types';
import { DefaultComponentProps } from '~modules/shared/types';

import './ContentPageLabelOverview.scss';

const ContentPageLabelOverview: FunctionComponent<DefaultComponentProps> = ({ className }) => {
	// Hooks
	const history = AdminConfigManager.getConfig().services.router.useHistory();
	const [contentPageLabel, setContentPageLabels] = useState<ContentPageLabel[] | null>(null);
	const [contentPageLabelCount, setContentPageLabelCount] = useState<number>(0);
	const [contentPageLabelIdToDelete, setContentPageLabelIdToDelete] = useState<number | null>(
		null
	);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });
	const [tableState, setTableState] = useState<Partial<ContentPageLabelTableState>>({});
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [contentTypes] = useContentTypes() as [any[], boolean];

	const fetchContentPageLabels = useCallback(async () => {
		setIsLoading(true);
		const generateWhereObject = (filters: Partial<ContentPageLabelTableState>) => {
			const andFilters: any[] = [];
			andFilters.push(
				...getQueryFilter(filters.query, (queryWildcard: string) => [
					{ label: { _ilike: queryWildcard } },
				])
			);
			andFilters.push(...getDateRangeFilters(filters, ['created_at', 'updated_at']));
			andFilters.push(...getMultiOptionFilters(filters, ['content_type']));
			return { _and: andFilters };
		};

		try {
			const [contentPageLabelTemp, contentPageLabelCountTemp] =
				await ContentPageLabelService.fetchContentPageLabels(
					tableState.page || 0,
					(tableState.sort_column || 'updated_at') as ContentPageLabelOverviewTableCols,
					tableState.sort_order || 'desc',
					generateWhereObject(getFilters(tableState))
				);

			setContentPageLabels(contentPageLabelTemp);
			setContentPageLabelCount(contentPageLabelCountTemp);
		} catch (err) {
			setLoadingInfo({
				state: 'error',
				message: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-page-labels/views/content-page-label-overview___het-ophalen-van-de-content-pagina-labels-is-mislukt'
				),
			});
		}
		setIsLoading(false);
	}, [setContentPageLabels, setLoadingInfo, tableState]);

	useEffect(() => {
		fetchContentPageLabels();
	}, [fetchContentPageLabels]);

	useEffect(() => {
		if (contentPageLabel && !isNil(contentPageLabelCount)) {
			setLoadingInfo({ state: 'loaded' });
		}
	}, [contentPageLabel, contentPageLabelCount]);

	const contentTypeOptions = contentTypes.map(
		(option): CheckboxOption => ({
			id: option.value,
			label: option.label,
			checked: (get(tableState, 'content_type', [] as string[]) as string[]).includes(
				option.value
			),
		})
	);

	const getContentPageLabelOverviewTableCols: () => FilterableColumn<ContentPageLabelOverviewTableCols>[] =
		() => [
			{
				id: 'label',
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-page-labels/views/content-page-label-overview___label'
				),
				sortable: true,
				visibleByDefault: true,
				dataType: TableColumnDataType.string,
			},
			{
				id: 'content_type',
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-page-labels/views/content-page-label-overview___type'
				),
				sortable: true,
				visibleByDefault: true,
				filterType: 'CheckboxDropdownModal',
				filterProps: {
					options: contentTypeOptions,
				} as CheckboxDropdownModalProps,
				dataType: TableColumnDataType.string,
			},
			{
				id: 'link_to',
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-page-labels/views/content-page-label-overview___link'
				),
				sortable: false,
				visibleByDefault: true,
			},
			{
				id: 'created_at',
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-page-labels/views/content-page-label-overview___gemaakt-op'
				),
				sortable: true,
				visibleByDefault: true,
				filterType: 'DateRangeDropdown',
				dataType: TableColumnDataType.dateTime,
			},
			{
				id: 'updated_at',
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-page-labels/views/content-page-label-overview___aangepast-op'
				),
				sortable: true,
				visibleByDefault: true,
				filterType: 'DateRangeDropdown',
				dataType: TableColumnDataType.dateTime,
			},
			{
				id: 'actions',
				tooltip: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-page-labels/views/content-page-label-overview___acties'
				),
				visibleByDefault: true,
			},
		];

	// Methods
	const handleDelete = async () => {
		if (isNil(contentPageLabelIdToDelete)) {
			AdminConfigManager.getConfig().services.toastService.showToast({
				title: AdminConfigManager.getConfig().services.i18n.tText(
					'react-admin/modules/content-page-labels/views/content-page-label-overview___error'
				),
				description: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-page-labels/views/content-page-label-overview___het-verwijderen-van-het-label-is-mislukt-omdat-geen-label-geselecteerd-is'
				),
				type: ToastType.ERROR,
			});
			return;
		}
		setIsConfirmModalOpen(false);
		await ContentPageLabelService.deleteContentPageLabel(contentPageLabelIdToDelete);
		await fetchContentPageLabels();
		AdminConfigManager.getConfig().services.toastService.showToast({
			title: AdminConfigManager.getConfig().services.i18n.tText(
				'react-admin/modules/content-page-labels/views/content-page-label-overview___succes'
			),
			description: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-page-labels/views/content-page-label-overview___de-content-pagina-label-is-verwijdert'
			),
			type: ToastType.SUCCESS,
		});
	};

	const openModal = (contentPageLabel: ContentPageLabel): void => {
		setIsConfirmModalOpen(true);
		setContentPageLabelIdToDelete(contentPageLabel.id);
	};

	// Render
	const renderTableCell = (
		rowData: ContentPageLabel,
		columnId: ContentPageLabelOverviewTableCols
	) => {
		switch (columnId) {
			case 'label':
				return (
					<Link
						to={buildLink(
							AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_DETAIL'),
							{ id: rowData.id }
						)}
					>
						{truncateTableValue(rowData[columnId])}
					</Link>
				);

			case 'created_at':
			case 'updated_at':
				return rowData[columnId] ? formatDate(rowData[columnId] as string) : '-';

			case 'link_to': {
				const linkTo = rowData.link_to;
				if (!linkTo) {
					return '-';
				}
				const labels = GET_CONTENT_TYPE_LABELS();
				return (
					<SmartLink action={linkTo} removeStyles={false}>{`${
						labels[linkTo.type]
					} - ${decodeURIComponent(
						String(linkTo.value)?.split('hetarchief.be')?.pop() || ''
					)}`}</SmartLink>
				);
			}

			case 'actions':
				return (
					<ButtonToolbar>
						<Button
							icon={<Icon name="info" />}
							onClick={() =>
								navigate(
									history,
									AdminConfigManager.getAdminRoute(
										'ADMIN_CONTENT_PAGE_LABEL_DETAIL'
									),
									{
										id: rowData.id,
									}
								)
							}
							aria-label={AdminConfigManager.getConfig().services.i18n.tText(
								'admin/content-page-labels/views/content-page-label-overview___bekijk-de-details-van-deze-content-pagina-label'
							)}
							title={AdminConfigManager.getConfig().services.i18n.tText(
								'admin/content-page-labels/views/content-page-label-overview___bekijk-de-details-van-deze-content-pagina-label'
							)}
							variants={['block', 'text']}
						/>
						<Button
							icon={<Icon name="edit" />}
							onClick={() =>
								navigate(
									history,
									AdminConfigManager.getAdminRoute(
										'ADMIN_CONTENT_PAGE_LABEL_EDIT'
									),
									{
										id: rowData.id,
									}
								)
							}
							aria-label={AdminConfigManager.getConfig().services.i18n.tText(
								'admin/content-page-labels/views/content-page-label-overview___bewerk-deze-content-pagina-label'
							)}
							title={AdminConfigManager.getConfig().services.i18n.tText(
								'admin/content-page-labels/views/content-page-label-overview___bewerk-deze-content-pagina-label'
							)}
							variants={['block', 'text']}
						/>
						<Button
							icon={<Icon name="delete" />}
							onClick={() => openModal(rowData)}
							aria-label={AdminConfigManager.getConfig().services.i18n.tText(
								'admin/content-page-labels/views/content-page-label-overview___verwijder-deze-content-pagina-label'
							)}
							title={AdminConfigManager.getConfig().services.i18n.tText(
								'admin/content-page-labels/views/content-page-label-overview___verwijder-deze-content-pagina-label'
							)}
							variants={['block', 'text']}
						/>
					</ButtonToolbar>
				);

			default:
				return truncateTableValue(rowData[columnId]);
		}
	};

	const renderNoResults = () => {
		return (
			<ErrorView
				message={AdminConfigManager.getConfig().services.i18n.tHtml(
					'admin/content-page-labels/views/content-page-label-overview___er-zijn-nog-geen-content-pagina-labels-aangemaakt'
				)}
			>
				<p>
					{AdminConfigManager.getConfig().services.i18n.tHtml(
						'admin/content-page-labels/views/content-page-label-overview___er-zijn-nog-geen-content-pagina-labels-aangemaakt'
					)}
				</p>
			</ErrorView>
		);
	};

	const renderContentPageLabelTable = () => {
		return (
			<>
				<FilterTable
					columns={getContentPageLabelOverviewTableCols()}
					data={contentPageLabel || []}
					dataCount={contentPageLabelCount}
					renderCell={(rowData: ContentPageLabel, columnId: string) =>
						renderTableCell(rowData, columnId as ContentPageLabelOverviewTableCols)
					}
					searchTextPlaceholder={AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-page-labels/views/content-page-label-overview___zoek-op-label'
					)}
					renderNoResults={renderNoResults}
					noContentMatchingFiltersMessage={AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-page-labels/views/content-page-label-overview___er-zijn-geen-content-pagina-labels-gevonden-die-voldoen-aan-je-zoekterm'
					)}
					itemsPerPage={ITEMS_PER_PAGE}
					onTableStateChanged={setTableState}
					isLoading={isLoading}
				/>
				<ConfirmModal
					deleteObjectCallback={handleDelete}
					isOpen={isConfirmModalOpen}
					onClose={() => setIsConfirmModalOpen(false)}
					title={AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-page-labels/views/content-page-label-overview___ben-je-zeker-dat-je-dit-label-wil-verwijderen'
					)}
					body={AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-page-labels/views/content-page-label-overview___deze-actie-kan-niet-ongedaan-gemaakt-worden'
					)}
				/>
			</>
		);
	};

	return (
		<AdminLayout
			pageTitle={AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-page-labels/views/content-page-label-overview___content-pagina-labels-overzicht'
			)}
			className={className}
		>
			<AdminLayout.Actions>
				<Button
					label={AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-page-labels/views/content-page-label-overview___content-pagina-label-toevoegen'
					)}
					onClick={() =>
						history.push(
							AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_CREATE')
						)
					}
				/>
			</AdminLayout.Actions>
			<AdminLayout.Content>
				<LoadingErrorLoadedComponent
					loadingInfo={loadingInfo}
					dataObject={contentPageLabel}
					render={renderContentPageLabelTable}
				/>
			</AdminLayout.Content>
		</AdminLayout>
	);
};

export default ContentPageLabelOverview;
