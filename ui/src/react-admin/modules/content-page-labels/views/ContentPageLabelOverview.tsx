import { Button } from '@meemoo/react-components';
import { ButtonToolbar } from '@viaa/avo2-components';
import { get, isNil } from 'lodash-es';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';

import { AdminConfigManager, ToastType } from '~core/config';
import { ContentPageLabelService } from '~modules/content-page-labels/content-page-label.service';
import { ITEMS_PER_PAGE } from '~modules/item/items.consts';
import { ErrorView } from '~modules/shared/components/error';
import { Link } from '~modules/shared/components/Link';
import { showToast } from '~modules/shared/helpers/show-toast';
import { DefaultComponentProps } from '~modules/shared/types';

import './ContentPageLabelOverview.scss';
import { useGetAllLanguages } from '~modules/translations/hooks/use-get-all-languages';
import { LanguageInfo } from '~modules/translations/translations.types';
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
import { GET_LANGUAGE_NAMES } from '~shared/consts/language-names';
import {
	getDateRangeFilters,
	getMultiOptionFilters,
	getQueryFilter,
} from '~shared/helpers/filters';
import { formatDate } from '~shared/helpers/formatters/date';
import { buildLink, navigate } from '~shared/helpers/link';
import { tHtml, tText } from '~shared/helpers/translation-functions';
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

const ContentPageLabelOverview: FunctionComponent<DefaultComponentProps> = ({ className }) => {
	// Hooks
	const history = AdminConfigManager.getConfig().services.router.useHistory();
	const [contentPageLabels, setContentPageLabels] = useState<ContentPageLabel[] | null>(null);
	const [contentPageLabelCount, setContentPageLabelCount] = useState<number>(0);
	const [contentPageLabelIdToDelete, setContentPageLabelIdToDelete] = useState<number | null>(
		null
	);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });
	const [tableState, setTableState] = useState<Partial<ContentPageLabelTableState>>({});
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [contentTypes] = useContentTypes() as [any[], boolean];
	const { data: allLanguages } = useGetAllLanguages();

	const generateWhereObject = (filters: Partial<ContentPageLabelTableState>) => {
		const andFilters: any[] = [];
		andFilters.push(
			...getQueryFilter(filters.query, (queryWildcard: string) => [
				{ label: { _ilike: queryWildcard } },
			])
		);
		andFilters.push(...getDateRangeFilters(filters, ['created_at', 'updated_at']));
		andFilters.push(...getMultiOptionFilters(filters, ['content_type', 'language']));
		return { _and: andFilters };
	};

	const fetchContentPageLabels = useCallback(async () => {
		setIsLoading(true);

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
				message: tText(
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
		if (contentPageLabels && !isNil(contentPageLabelCount)) {
			setLoadingInfo({ state: 'loaded' });
		}
	}, [contentPageLabels, contentPageLabelCount]);

	const contentTypeOptions = contentTypes.map(
		(option): CheckboxOption => ({
			id: option.value,
			label: option.label,
			checked: (get(tableState, 'content_type', [] as string[]) as string[]).includes(
				option.value
			),
		})
	);
	const languageOptions = (allLanguages || []).map(
		(languageInfo: LanguageInfo): CheckboxOption => ({
			id: languageInfo.languageCode,
			label: GET_LANGUAGE_NAMES()[languageInfo.languageCode],
			checked: (tableState?.language || []).includes(languageInfo.languageCode),
		})
	);

	const getContentPageLabelOverviewTableCols: () => FilterableColumn<ContentPageLabelOverviewTableCols>[] =
		() => [
			{
				id: 'label',
				label: tText('admin/content-page-labels/views/content-page-label-overview___label'),
				sortable: true,
				visibleByDefault: true,
				dataType: TableColumnDataType.string,
			},
			{
				id: 'content_type',
				label: tText('admin/content-page-labels/views/content-page-label-overview___type'),
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
				label: tText('admin/content-page-labels/views/content-page-label-overview___link'),
				sortable: false,
				visibleByDefault: true,
			},
			{
				id: 'language',
				label: tText(
					'modules/content-page-labels/views/content-page-label-overview___taal'
				),
				sortable: true,
				visibleByDefault: true,
				filterType: 'CheckboxDropdownModal',
				filterProps: {
					options: languageOptions,
				} as CheckboxDropdownModalProps,
				dataType: TableColumnDataType.string,
			},
			{
				id: 'created_at',
				label: tText(
					'admin/content-page-labels/views/content-page-label-overview___gemaakt-op'
				),
				sortable: true,
				visibleByDefault: true,
				filterType: 'DateRangeDropdown',
				dataType: TableColumnDataType.dateTime,
			},
			{
				id: 'updated_at',
				label: tText(
					'admin/content-page-labels/views/content-page-label-overview___aangepast-op'
				),
				sortable: true,
				visibleByDefault: true,
				filterType: 'DateRangeDropdown',
				dataType: TableColumnDataType.dateTime,
			},
			{
				id: 'actions',
				tooltip: tText(
					'admin/content-page-labels/views/content-page-label-overview___acties'
				),
				visibleByDefault: true,
			},
		];

	// Methods
	const handleDelete = async () => {
		if (isNil(contentPageLabelIdToDelete)) {
			showToast({
				title: tText(
					'react-admin/modules/content-page-labels/views/content-page-label-overview___error'
				),
				description: tText(
					'admin/content-page-labels/views/content-page-label-overview___het-verwijderen-van-het-label-is-mislukt-omdat-geen-label-geselecteerd-is'
				),
				type: ToastType.ERROR,
			});
			return;
		}
		setIsConfirmModalOpen(false);
		await ContentPageLabelService.deleteContentPageLabel(contentPageLabelIdToDelete);
		await fetchContentPageLabels();
		showToast({
			title: tText(
				'react-admin/modules/content-page-labels/views/content-page-label-overview___succes'
			),
			description: tText(
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
		contentPageLabel: ContentPageLabel,
		columnId: ContentPageLabelOverviewTableCols
	) => {
		switch (columnId) {
			case 'label':
				return (
					<Link
						to={buildLink(
							AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_DETAIL'),
							{ id: contentPageLabel.id }
						)}
					>
						{truncateTableValue(contentPageLabel[columnId])}
					</Link>
				);

			case 'created_at':
			case 'updated_at':
				return contentPageLabel[columnId]
					? formatDate(contentPageLabel[columnId] as string)
					: '-';

			case 'link_to': {
				const linkTo = contentPageLabel.link_to;
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

			case 'language': {
				return contentPageLabel.language;
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
										id: contentPageLabel.id,
									}
								)
							}
							aria-label={tText(
								'admin/content-page-labels/views/content-page-label-overview___bekijk-de-details-van-deze-content-pagina-label'
							)}
							title={tText(
								'admin/content-page-labels/views/content-page-label-overview___bekijk-de-details-van-deze-content-pagina-label'
							)}
							variants={['block', 'text', 'secondary']}
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
										id: contentPageLabel.id,
									}
								)
							}
							aria-label={tText(
								'admin/content-page-labels/views/content-page-label-overview___bewerk-deze-content-pagina-label'
							)}
							title={tText(
								'admin/content-page-labels/views/content-page-label-overview___bewerk-deze-content-pagina-label'
							)}
							variants={['block', 'text', 'secondary']}
						/>
						<Button
							icon={<Icon name="delete" />}
							onClick={() => openModal(contentPageLabel)}
							aria-label={tText(
								'admin/content-page-labels/views/content-page-label-overview___verwijder-deze-content-pagina-label'
							)}
							title={tText(
								'admin/content-page-labels/views/content-page-label-overview___verwijder-deze-content-pagina-label'
							)}
							variants={['block', 'text', 'secondary']}
						/>
					</ButtonToolbar>
				);

			default:
				return truncateTableValue(contentPageLabel[columnId]);
		}
	};

	const renderNoResults = () => {
		return (
			<ErrorView
				message={tHtml(
					'admin/content-page-labels/views/content-page-label-overview___er-zijn-nog-geen-content-pagina-labels-aangemaakt'
				)}
			>
				<p>
					{tHtml(
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
					data={contentPageLabels || []}
					dataCount={contentPageLabelCount}
					renderCell={(rowData: ContentPageLabel, columnId: string) =>
						renderTableCell(rowData, columnId as ContentPageLabelOverviewTableCols)
					}
					searchTextPlaceholder={tText(
						'admin/content-page-labels/views/content-page-label-overview___zoek-op-label'
					)}
					renderNoResults={renderNoResults}
					noContentMatchingFiltersMessage={tText(
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
					title={tText(
						'admin/content-page-labels/views/content-page-label-overview___ben-je-zeker-dat-je-dit-label-wil-verwijderen'
					)}
					body={tText(
						'admin/content-page-labels/views/content-page-label-overview___deze-actie-kan-niet-ongedaan-gemaakt-worden'
					)}
				/>
			</>
		);
	};

	return (
		<AdminLayout
			pageTitle={tText(
				'admin/content-page-labels/views/content-page-label-overview___content-pagina-labels-overzicht'
			)}
			className={className}
		>
			<AdminLayout.Actions>
				<Button
					label={tText(
						'admin/content-page-labels/views/content-page-label-overview___content-pagina-label-toevoegen'
					)}
					onClick={() =>
						history.push(
							AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_CREATE')
						)
					}
					variants={['primary']}
				/>
			</AdminLayout.Actions>
			<AdminLayout.Content>
				<LoadingErrorLoadedComponent
					loadingInfo={loadingInfo}
					dataObject={contentPageLabels}
					render={renderContentPageLabelTable}
				/>
			</AdminLayout.Content>
		</AdminLayout>
	);
};

export default ContentPageLabelOverview;
