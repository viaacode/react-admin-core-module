import { Badge, Button } from '@meemoo/react-components';
import type { IPagination } from '@studiohyperdrive/pagination';

import { format, isAfter, isWithinInterval, parseISO } from 'date-fns';
import { nlBE } from 'date-fns/locale';
import type { FunctionComponent, ReactNode } from 'react';
import { useState } from 'react';
import { ToastType } from '~core/config/config.types';
import { ITEMS_PER_PAGE } from '~modules/item/items.consts';
import { useGetMaintenanceAlerts } from '~modules/maintenance-alerts/hooks/use-get-maintenance-alerts';
import type { MaintenanceAlertsOverviewTableState } from '~modules/maintenance-alerts/maintenance-alerts.types';
import MaintenanceAlertsEditForm from '~modules/maintenance-alerts/views/MaintenanceAlertsEditForm';
import ConfirmModal from '~modules/shared/components/ConfirmModal/ConfirmModal';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { AdminLayout } from '~modules/shared/layouts/AdminLayout/AdminLayout';
import { useGetAllLanguages } from '~modules/translations/hooks/use-get-all-languages';
import { Locale } from '~modules/translations/translations.core.types';
import type { LanguageInfo } from '~modules/translations/translations.types';
import type {
	CheckboxDropdownModalProps,
	CheckboxOption,
} from '~shared/components/CheckboxDropdownModal/CheckboxDropdownModal';
import { ErrorView } from '~shared/components/error/ErrorView';
import type { FilterableColumn } from '~shared/components/FilterTable/FilterTable';
import FilterTable from '~shared/components/FilterTable/FilterTable';
import { Icon } from '~shared/components/Icon/Icon';
import { Loading } from '~shared/components/Loading/Loading';
import { GET_LANGUAGE_NAMES } from '~shared/consts/language-names';
import { parseAsIsoWithoutTimezone } from '~shared/helpers/formatters/date';
import { isMultiLanguageEnabled } from '~shared/helpers/is-multi-language-enabled';
import { showToast } from '~shared/helpers/show-toast';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import { TableColumnDataType } from '~shared/types/table-column-data-type';
import { TableFilterType } from '~shared/types/table-filter-types';
import { App } from '../../../../../scripts/translation.types';
import { MaintenanceAlertsService } from '../maintenance-alerts.service';
import type {
	MaintenanceAlert,
	MaintenanceAlertsOverviewProps,
	MaintenanceAlertsOverviewTableCol,
} from '../maintenance-alerts.types';

export const MaintenanceAlertsOverview: FunctionComponent<MaintenanceAlertsOverviewProps> = ({
	className,
	renderPopup,
}) => {
	const [tableState, setTableState] = useState<Partial<MaintenanceAlertsOverviewTableState>>({});
	const {
		data: maintenanceAlerts,
		isLoading,
		refetch: refetchMaintenanceAlerts,
	} = useGetMaintenanceAlerts(tableState);
	const [activeMaintenanceAlert, setActiveMaintenanceAlert] = useState<MaintenanceAlert | null>(
		null
	);
	const [action, setAction] = useState<'create' | 'edit' | null>(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
	const [alertToDeleteId, setAlertToDeleteId] = useState<string>();
	const { data: allLanguages } = useGetAllLanguages();

	const languageOptions = (allLanguages || []).map(
		(languageInfo: LanguageInfo): CheckboxOption => ({
			id: languageInfo.languageCode,
			label: GET_LANGUAGE_NAMES()[languageInfo.languageCode],
			checked: (tableState?.language || []).includes(languageInfo.languageCode),
		})
	);

	const checkIsAlertActive = (from: string, till: string): boolean => {
		if (!isAfter(parseISO(till), parseISO(from))) {
			return false;
		}

		return isWithinInterval(new Date(), {
			start: parseAsIsoWithoutTimezone(from),
			end: parseAsIsoWithoutTimezone(till),
		});
	};

	// Actions
	const onClickCreate = () => {
		setAction('create');
		setActiveMaintenanceAlert({
			id: '',
			title: '',
			message: '',
			type: '',
			userGroups: [],
			fromDate: '',
			untilDate: '',
			language: Locale.Nl,
		});
	};

	const onClickDelete = async () => {
		if (!alertToDeleteId) {
			return;
		}

		try {
			await MaintenanceAlertsService.deleteAlert(alertToDeleteId);

			showToast({
				title: tText('react-admin/modules/alerts/views/alerts-overview___succes', {}, [
					App.HET_ARCHIEF,
				]),
				description: tText(
					'react-admin/modules/alerts/views/alerts-overview___het-verwijderen-van-de-melding-is-gelukt',
					{},
					[App.HET_ARCHIEF]
				),
				type: ToastType.SUCCESS,
			});
		} catch (err) {
			console.error(new CustomError('Failed to delete alert', err));

			showToast({
				title: tText('react-admin/modules/alerts/views/alerts-overview___error', {}, [
					App.HET_ARCHIEF,
				]),
				description: tText(
					'react-admin/modules/alerts/views/alerts-overview___het-verwijderen-van-de-melding-is-mislukt',
					{},
					[App.HET_ARCHIEF]
				),
				type: ToastType.ERROR,
			});
		}

		await refetchMaintenanceAlerts();
	};

	const handleCloseEditPopup = async () => {
		setAction(null);
		setActiveMaintenanceAlert(null);
		await refetchMaintenanceAlerts();
	};

	const renderTableCell = (
		maintenanceAlert: MaintenanceAlert,
		columnId: MaintenanceAlertsOverviewTableCol
	) => {
		switch (columnId) {
			case 'title':
				return maintenanceAlert.title;

			case 'fromDate':
			case 'untilDate':
				return format(parseISO(maintenanceAlert[columnId]), 'PPP', {
					locale: nlBE,
				});

			case 'status':
				return (
					<Badge
						text={
							checkIsAlertActive(maintenanceAlert.fromDate, maintenanceAlert.untilDate)
								? tText('modules/alerts/views/alerts-overview___actief', {}, [App.HET_ARCHIEF])
								: tText('modules/alerts/views/alerts-overview___inactief', {}, [App.HET_ARCHIEF])
						}
						variants={
							checkIsAlertActive(maintenanceAlert.fromDate, maintenanceAlert.untilDate)
								? ['success']
								: ['grey']
						}
					/>
				);

			case 'language': {
				return maintenanceAlert.language;
			}

			case 'actions':
				return (
					<>
						<Button
							icon={<Icon name="edit" />}
							className="u-color-neutral"
							variants="text"
							onClick={() => {
								setActiveMaintenanceAlert(maintenanceAlert);
								setAction('edit');
							}}
							title={tText(
								'modules/maintenance-alerts/views/maintenance-alerts-overview___hover-bewerk-notificatie',
								{},
								[App.HET_ARCHIEF]
							)}
						/>
						<Button
							icon={<Icon name="delete" />}
							className="u-color-neutral"
							variants="text"
							onClick={() => {
								setAlertToDeleteId(maintenanceAlert.id);
								setIsDeleteModalOpen(true);
							}}
							title={tText(
								'modules/maintenance-alerts/views/maintenance-alerts-overview___hover-verwijder-notificatie',
								{},
								[App.HET_ARCHIEF]
							)}
						/>
					</>
				);
		}
	};

	const getMaintenanceAlertOverviewTableCols: () => FilterableColumn<MaintenanceAlertsOverviewTableCol>[] =
		() => [
			{
				id: 'title',
				label: tText('modules/alerts/views/alerts-overview___titel-melding', {}, [App.HET_ARCHIEF]),
				sortable: true,
				visibleByDefault: true,
				dataType: TableColumnDataType.string,
			},
			{
				id: 'fromDate',
				label: tText('modules/alerts/views/alerts-overview___zichtbaar-van', {}, [App.HET_ARCHIEF]),
				sortable: true,
				visibleByDefault: true,
			},
			{
				id: 'untilDate',
				label: tText('modules/alerts/views/alerts-overview___zichtbaar-tot', {}, [App.HET_ARCHIEF]),
				sortable: true,
				visibleByDefault: true,
			},
			{
				id: 'status',
				label: tText('modules/alerts/views/alerts-overview___status', {}, [App.HET_ARCHIEF]),
				sortable: true,
				visibleByDefault: true,
			},
			...(isMultiLanguageEnabled()
				? [
						{
							id: 'language' as const,
							label: tText(
								'modules/maintenance-alerts/views/maintenance-alerts-overview___taal',
								{},
								[App.HET_ARCHIEF]
							),
							sortable: true,
							visibleByDefault: true,
							filterType: TableFilterType.CheckboxDropdownModal,
							filterProps: {
								options: languageOptions,
							} as CheckboxDropdownModalProps,
							dataType: TableColumnDataType.string,
						},
					]
				: []),
			{
				id: 'actions',
				tooltip: tText('admin/content-page-labels/views/content-page-label-overview___acties', {}, [
					App.HET_ARCHIEF,
				]),
				visibleByDefault: true,
			},
		];

	const renderNoResults = () => {
		return (
			<ErrorView
				message={tHtml(
					'modules/maintenance-alerts/views/maintenance-alerts-overview___er-zijn-nog-geen-meldingen-aangemaakt',
					{},
					[App.HET_ARCHIEF]
				)}
				locationId="maintenance-alerts-overview--no-results"
			>
				<p>
					{tHtml(
						'modules/maintenance-alerts/views/maintenance-alerts-overview___er-zijn-nog-geen-meldingen-aangemaakt',
						{},
						[App.HET_ARCHIEF]
					)}
				</p>
			</ErrorView>
		);
	};

	const renderAlertsTable = (alerts: IPagination<MaintenanceAlert[]>): ReactNode => {
		if (!alerts) {
			return <Loading locationId="maintanance-alerts--loading" />;
		}

		if (!alerts.items.length) {
			return (
				<>
					{tHtml(
						'react-admin/modules/alerts/views/alerts-overview___er-zijn-geen-meldingen-gevonden',
						{},
						[App.HET_ARCHIEF]
					)}
				</>
			);
		}

		return (
			<FilterTable
				columns={getMaintenanceAlertOverviewTableCols()}
				data={alerts.items || []}
				dataCount={alerts.total}
				renderCell={(maintenanceAlert: MaintenanceAlert, columnId: string) =>
					renderTableCell(maintenanceAlert, columnId as MaintenanceAlertsOverviewTableCol)
				}
				searchTextPlaceholder={tText(
					'modules/maintenance-alerts/views/maintenance-alerts-overview___zoeken-op-titel-of-bericht',
					{},
					[App.HET_ARCHIEF]
				)}
				renderNoResults={renderNoResults}
				noContentMatchingFiltersMessage={tText(
					'modules/maintenance-alerts/views/maintenance-alerts-overview___er-zijn-geen-meldingen-gevonden-die-voldoen-aan-je-zoekterm',
					{},
					[App.HET_ARCHIEF]
				)}
				itemsPerPage={ITEMS_PER_PAGE}
				onTableStateChanged={setTableState}
				isLoading={isLoading}
				searchInputAriaLabel={tText(
					'modules/maintenance-alerts/views/maintenance-alerts-overview___zoek-input-aria-label',
					{},
					[App.HET_ARCHIEF]
				)}
			/>
		);
	};

	const title = tText('react-admin/modules/alerts/views/alerts-overview___meldingen', {}, [
		App.HET_ARCHIEF,
	]);
	return (
		<AdminLayout className={className} pageTitle={title}>
			<AdminLayout.Actions>
				<Button
					iconStart={<Icon name="export" />}
					label={tText(
						'react-admin/modules/alerts/views/alerts-overview___nieuwe-melding-aanmaken',
						{},
						[App.HET_ARCHIEF]
					)}
					onClick={() => onClickCreate()}
					variants="black"
				/>
			</AdminLayout.Actions>

			<AdminLayout.Content>
				<div className={className}>{maintenanceAlerts && renderAlertsTable(maintenanceAlerts)}</div>

				{activeMaintenanceAlert && (
					<MaintenanceAlertsEditForm
						renderPopup={renderPopup}
						maintenanceAlert={activeMaintenanceAlert}
						action={action}
						onClose={handleCloseEditPopup}
					></MaintenanceAlertsEditForm>
				)}
				<ConfirmModal
					deleteObjectCallback={onClickDelete}
					body={tHtml(
						'react-admin/modules/alerts/views/alerts-overview___het-verwijderen-van-een-melding-kan-niet-ongedaan-gemaakt-worden',
						{},
						[App.HET_ARCHIEF]
					)}
					isOpen={isDeleteModalOpen}
					onClose={() => {
						setAlertToDeleteId(undefined);
						setIsDeleteModalOpen(false);
					}}
				/>
			</AdminLayout.Content>
		</AdminLayout>
	);
};
