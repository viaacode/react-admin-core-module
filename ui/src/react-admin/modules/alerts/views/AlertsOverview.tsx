import {
	Badge,
	Button,
	Checkbox,
	Datepicker,
	FormControl,
	Row,
	Select,
	Table,
	TableOptions,
	TextArea,
	TextInput,
	Timepicker,
} from '@meemoo/react-components';
import { IPagination } from '@studiohyperdrive/pagination';
import { Avo } from '@viaa/avo2-types';

import { format, isWithinInterval } from 'date-fns';
import { FunctionComponent, ReactNode, useCallback, useEffect, useState } from 'react';
import { useQueryParams } from 'use-query-params';
import { Loader } from '~modules/shared/components';
import { CheckboxDropdownModal } from '~modules/shared/components/CheckboxDropdownModal/CheckboxDropdownModal';
import Html from '~modules/shared/components/Html/Html';
import { IconPicker } from '~modules/shared/components/IconPicker/IconPicker';
import { PaginationBar } from '~modules/shared/components/PaginationBar';
import { sortingIcons } from '~modules/shared/components/Table/Table.const';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { useTranslation } from '~modules/shared/hooks/useTranslation';
import { AdminLayout } from '~modules/shared/layouts';
import { AdminConfigManager, ToastType } from '../../../../index-export';
import { ALERTS_QUERY_PARAM_CONFIG } from '../alerts.const';
import { AlertsService } from '../alerts.service';
import { Alert, AlertsOverviewProps, AlertsOverviewTableCol } from '../alerts.types';

const AlertsOverview: FunctionComponent<AlertsOverviewProps> = ({ className, renderPopup }) => {
	const { tText, tHtml } = useTranslation();
	const [alerts, setAlerts] = useState<IPagination<Alert[]>>();
	const [filters, setFilters] = useQueryParams(ALERTS_QUERY_PARAM_CONFIG);
	const [activeAlert, setActiveAlert] = useState<Alert | null>(null);
	const [action, setAction] = useState<string | null>(null);

	const getAlerts = useCallback(async () => {
		try {
			const allAlerts = await AlertsService.fetchAlerts(
				filters.orderProp as AlertsOverviewTableCol,
				filters.orderDirection as Avo.Search.OrderDirection,
				filters.page
			);

			setAlerts(allAlerts);
		} catch (err) {
			console.error(new CustomError('Failed to fetch alerts', err));

			AdminConfigManager.getConfig().services.toastService.showToast({
				title: tText('react-admin/modules/alerts/views/alerts-overview___error'),
				description: tText(
					'react-admin/modules/alerts/views/alerts-overview___het-ophalen-van-de-meldingen-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}
	}, [setAlerts, filters]);

	const handleSortChange = useCallback(
		(orderProp, orderDirection) => {
			if (filters.orderProp !== orderProp || filters.orderDirection !== orderDirection) {
				setFilters({
					...filters,
					orderProp,
					orderDirection,
				});
			}
		},
		[filters.orderProp, filters.orderDirection]
	);

	useEffect(() => {
		console.log(action);
	}, [action]);

	useEffect(() => {
		getAlerts();
	}, []);

	const checkAlertActivity = (from: string, till: string) => {
		const isActive = isWithinInterval(new Date(), {
			start: new Date(from),
			end: new Date(till),
		});
		return isActive ? 'actief' : 'inactief';
	};

	const renderAlertsTable = (alerts: IPagination<Alert[]>): ReactNode => {
		if (!alerts) {
			return <Loader />;
		}

		if (!alerts.items.length) {
			return (
				<>
					{tHtml(
						'react-admin/modules/alerts/views/alerts-overview___er-zijn-geen-meldingen-gevonden'
					)}
				</>
			);
		}

		return (
			<>
				<Table
					options={
						{
							columns: [
								{
									id: 'title',
									Header: tHtml(
										'modules/alerts/views/alerts-overview___titel-melding'
									),
									accessor: 'title',
									Cell: ({ row }: { row: Row<Alert> }) => {
										return (
											<Html
												content={row.original.title}
												className="c-content"
											/>
										);
									},
								},
								{
									id: 'fromDate',
									Header: tHtml(
										'modules/alerts/views/alerts-overview___zichtbaar-van'
									),
									accessor: 'fromDate',
									Cell: ({ row }: { row: Row<Alert> }) => {
										return (
											<Html
												content={format(
													new Date(row.original.fromDate),
													'i LLL y'
												)}
											/>
										);
									},
								},
								{
									id: 'untilDate',
									Header: tHtml(
										'modules/alerts/views/alerts-overview___zichtbaar-tot'
									),
									accessor: 'untilDate',
									Cell: ({ row }: { row: Row<Alert> }) => {
										return (
											<Html
												content={format(
													new Date(row.original.untilDate),
													'i LLL y'
												)}
											/>
										);
									},
								},
								{
									id: 'status',
									Header: tHtml('modules/alerts/views/alerts-overview___status'),
									Cell: ({ row }: { row: Row<Alert> }) => {
										return (
											<Badge
												text={checkAlertActivity(
													row.original.fromDate,
													row.original.untilDate
												)}
											/>
										);
									},
								},
								{
									id: 'edit',
									Header: '',
									Cell: ({ row }: { row: Row<Alert> }) => {
										return (
											<Button
												icon={
													AdminConfigManager.getConfig().icon
														?.componentProps.edit.name as string
												}
												onClick={() => {
													setActiveAlert(row.original);
													setAction('edit');
												}}
											/>
										);
									},
								},
								{
									id: 'delete',
									Header: '',
									Cell: () => {
										return (
											<Button
												icon={
													AdminConfigManager.getConfig().icon
														?.componentProps.delete.name as string
												}
												onClick={() => setAction('delete')}
											/>
										);
									},
								},
							],
							data: alerts.items || [],
							initialState: {
								pageSize: 20,
							},
						} as TableOptions<any>
					}
					onSortChange={handleSortChange}
					sortingIcons={sortingIcons}
					pagination={({ gotoPage }) => {
						return (
							<PaginationBar
								className="u-mt-16 u-mb-16"
								count={20}
								start={Math.max(0, filters.page - 1) * 20}
								total={alerts.pages || 1}
								onPageChange={(pageZeroBased) => {
									gotoPage(pageZeroBased);
									setFilters({
										...filters,
										page: pageZeroBased + 1,
									});
								}}
							/>
						);
					}}
				/>
			</>
		);
	};

	const onClickCreate = () => {
		setAction('create');
		setActiveAlert({
			id: '',
			title: '',
			message: '',
			icon: '',
			userGroups: [],
			fromDate: '',
			untilDate: '',
			active: false,
		});
	};

	const renderPopupBody = () => {
		if (!activeAlert) {
			return;
		}

		return (
			<>
				<FormControl
					id="new-alert-title"
					label={tHtml(
						'react-admin/modules/alerts/views/alerts-overview___titel-melding'
					)}
				>
					<TextInput value={activeAlert.title} />
				</FormControl>

				<FormControl
					id="new-alert-message"
					label={tHtml('react-admin/modules/alerts/views/alerts-overview___beschrijving')}
				>
					<TextArea value={activeAlert.message} />
				</FormControl>

				<FormControl
					id="new-alert-icon"
					label={tHtml(
						'react-admin/modules/alerts/views/alerts-overview___verduidelijkend-icoon'
					)}
				>
					<IconPicker value={activeAlert.icon} />
				</FormControl>
				<FormControl
					id="new-alert-user-group"
					label={tHtml(
						'react-admin/modules/alerts/views/alerts-overview___zichtbaar-voor-gebruikersgroep'
					)}
				>
					<CheckboxDropdownModal
						options={[
							{ label: 'testoption', id: 'testoption', checked: false },
							{ label: 'testoption2', id: 'testoption2', checked: false },
						]}
						label=""
						id="test"
						onChange={(value) => console.log(value)}
					/>
				</FormControl>

				<FormControl
					id="new-alert-icon"
					label={tHtml(
						'react-admin/modules/alerts/views/alerts-overview___zichtbaar-van'
					)}
				>
					<Datepicker />

					<Timepicker />
				</FormControl>

				<FormControl
					id="new-alert-icon"
					label={tHtml(
						'react-admin/modules/alerts/views/alerts-overview___zichtbaar-tot'
					)}
				>
					<>
						<Datepicker />

						<Timepicker />
					</>
				</FormControl>

				<Checkbox
					label={tText('react-admin/modules/alerts/views/alerts-overview___zet-actief')}
				/>
			</>
		);
	};

	const title = tText('react-admin/modules/alerts/views/alerts-overview___meldingen');

	return (
		<AdminLayout className={className} pageTitle={title}>
			<AdminLayout.Actions>
				<Button
					label={tText(
						'react-admin/modules/alerts/views/alerts-overview___nieuwe-melding-aanmaken'
					)}
					onClick={() => onClickCreate()}
				/>
			</AdminLayout.Actions>

			<AdminLayout.Content>
				<div className={className}>{alerts && renderAlertsTable(alerts)}</div>

				{renderPopup({
					title: tText(
						'react-admin/modules/alerts/views/alerts-overview___melding-aanpassen'
					),
					body: renderPopupBody(),
					isOpen: !!activeAlert,
					onSave: () => console.log('save'),
					onClose: () => {
						setActiveAlert(null);
						setAction(null);
					},
				})}
			</AdminLayout.Content>
		</AdminLayout>
	);
};

export default AlertsOverview as FunctionComponent<AlertsOverviewProps>;
