import {
	Badge,
	Button,
	Checkbox,
	FormControl,
	Pagination,
	Row,
	Select,
	Table,
	TableOptions,
	TextArea,
	TextInput,
	Timepicker,
} from '@meemoo/react-components';
import { Icon, IconName } from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';

import { format, isWithinInterval } from 'date-fns';
import { FunctionComponent, ReactNode, useCallback, useEffect, useState } from 'react';
import { useQueryParams } from 'use-query-params';
import { Loader } from '~modules/shared/components';
import Html from '~modules/shared/components/Html/Html';
import { IconPicker } from '~modules/shared/components/IconPicker/IconPicker';
import { sortingIcons } from '~modules/shared/components/Table/Table.const';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { useTranslation } from '~modules/shared/hooks/useTranslation';
import { AdminLayout } from '~modules/shared/layouts';
import { AdminConfigManager, ToastType } from '../../../../index-export';
import { ALERTS_QUERY_PARAM_CONFIG } from '../alerts.const';
import { AlertsService } from '../alerts.service';
import { Alert, AlertsOverviewProps, AlertsOverviewTableCol } from '../alerts.types';
import { convertFromDatabaseToList } from '../helpers/database-conversions';

const AlertsOverview: FunctionComponent<AlertsOverviewProps> = ({ className, renderPopup }) => {
	const { tText, tHtml } = useTranslation();
	const [alerts, setAlerts] = useState<Alert[]>();
	const [filters, setFilters] = useQueryParams(ALERTS_QUERY_PARAM_CONFIG);
	const [activeAlert, setActiveAlert] = useState<Alert | null>(null);

	const getAlerts = useCallback(async () => {
		try {
			const allAlerts = await AlertsService.fetchAlerts(
				filters.orderProp as AlertsOverviewTableCol,
				filters.orderDirection as Avo.Search.OrderDirection
			);

			setAlerts(convertFromDatabaseToList(allAlerts));
		} catch (err) {
			console.error(new CustomError('Failed to fetch alerts', err));

			AdminConfigManager.getConfig().services.toastService.showToast({
				title: tText('react-admin/modules/alerts/views/alerts-overview___error'),
				description: tText(
					'react-admin/modules/alerts/views/alerts-overview___het-ophale-van-de-meldingen-is-mislukt'
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
		getAlerts();
	}, []);

	const checkAlertActivity = (from: string, till: string) => {
		const isActive = isWithinInterval(new Date(), {
			start: new Date(from),
			end: new Date(till),
		});
		return isActive ? 'actief' : 'inactief';
	};

	const renderAlertsTable = (): ReactNode => {
		if (!alerts) {
			return <Loader />;
		}

		if (!alerts.length) {
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
												onClick={() => setActiveAlert(row.original)}
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
												onClick={() => console.log('delete')}
											/>
										);
									},
								},
							],
							data: alerts,
							initialState: {
								pageSize: 20,
							},
						} as TableOptions<any>
					}
					onSortChange={handleSortChange}
					sortingIcons={sortingIcons}
				/>
				<Pagination pageCount={100} />
			</>
		);
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
					<TextInput />
				</FormControl>

				<FormControl
					id="new-alert-message"
					label={tHtml('react-admin/modules/alerts/views/alerts-overview___beschrijving')}
				>
					<TextArea />
				</FormControl>

				<FormControl
					id="new-alert-icon"
					label={tHtml(
						'react-admin/modules/alerts/views/alerts-overview___verduidelijkend-icoon'
					)}
				>
					<IconPicker />
				</FormControl>

				<FormControl
					id="new-alert-icon"
					label={tHtml(
						'react-admin/modules/alerts/views/alerts-overview___zichtbaar-van'
					)}
				>
					<Timepicker />
				</FormControl>

				<FormControl
					id="new-alert-icon"
					label={tHtml(
						'react-admin/modules/alerts/views/alerts-overview___zichtbaar-tot'
					)}
				>
					<Timepicker />
				</FormControl>

				<Checkbox label={tText('react-admin/modules/alerts/views/alerts-overview___zet-actief')} />
			</>
		);
	};

	const title = tText('react-admin/modules/alerts/views/alerts-overview___meldingen');

	return (
		<AdminLayout pageTitle={title}>
			<AdminLayout.Actions>
				<Button
					label={tText(
						'react-admin/modules/alerts/views/alerts-overview___nieuwe-melding-aanmaken'
					)}
					onClick={() => console.log('click')}
				/>
			</AdminLayout.Actions>

			<AdminLayout.Content>
				<div className={className}>{alerts && renderAlertsTable()}</div>
				{renderPopup({
					title: tText(
						'react-admin/modules/alerts/views/alerts-overview___melding-aanpassen'
					),
					body: renderPopupBody(),
					isOpen: !!activeAlert,
					onSave: () => console.log('save'),
					onClose: () => console.log('close'),
				})}
			</AdminLayout.Content>
		</AdminLayout>
	);
};

export default AlertsOverview as FunctionComponent<AlertsOverviewProps>;
