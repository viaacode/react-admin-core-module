import {
	Badge,
	Button,
	Checkbox,
	Datepicker,
	FormControl,
	RichEditorState,
	RichTextEditor,
	Row,
	Table,
	TableOptions,
	TextInput,
	Timepicker,
} from '@meemoo/react-components';
import { IPagination } from '@studiohyperdrive/pagination';
import { Avo } from '@viaa/avo2-types';

import { yupResolver } from '@hookform/resolvers/yup';

import {
	add,
	endOfDay,
	format,
	isAfter,
	isSameDay,
	isWithinInterval,
	roundToNearestMinutes,
	set,
	startOfDay,
} from 'date-fns';
import { FunctionComponent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import {
	ALERTS_FORM_SCHEMA,
	ALERTS_QUERY_PARAM_CONFIG,
	alertUserGroups,
	GET_ADMIN_ICON_OPTIONS,
	RICH_TEXT_EDITOR_OPTIONS,
} from '../alerts.const';
import { AlertsService } from '../alerts.service';
import {
	Alert,
	AlertFormState,
	AlertsOverviewProps,
	AlertsOverviewTableCol,
} from '../alerts.types';
import { ReactSelectOption } from '~modules/shared';
import { get, now } from 'lodash-es';
import { nlBE } from 'date-fns/locale';
import ConfirmModal from '~modules/shared/components/ConfirmModal/ConfirmModal';

const roundToNearestQuarter = (date: Date) => roundToNearestMinutes(date, { nearestTo: 15 });
const defaultStartDate = (start: Date) => roundToNearestQuarter(start);
const defaultEndDate = (startDate: Date) => set(startDate, { hours: 23, minutes: 59 });

const AlertsOverview: FunctionComponent<AlertsOverviewProps> = ({ className, renderPopup }) => {
	const { tText, tHtml } = useTranslation();
	const [alerts, setAlerts] = useState<IPagination<Alert[]>>();
	const [filters, setFilters] = useQueryParams(ALERTS_QUERY_PARAM_CONFIG);
	const [activeAlert, setActiveAlert] = useState<Alert | null>(null);
	const [action, setAction] = useState<string | null>(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
	const [alertToDeleteId, setAlertToDeleteId] = useState<string>();

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
		getAlerts();
	}, []);

	const checkAlertActivity = (from: string, till: string) => {
		if (!isAfter(new Date(till), new Date(from))) {
			return '-';
		}

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
													'PP',
													{
														locale: nlBE,
													}
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
													'PP',
													{
														locale: nlBE,
													}
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
									Cell: ({ row }) => {
										return (
											<Button
												icon={
													AdminConfigManager.getConfig().icon
														?.componentProps.delete.name as string
												}
												onClick={() => {
													setAlertToDeleteId(row.original.id);
													setIsDeleteModalOpen(true);
												}}
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

	const defaultValues = useMemo(
		() =>
			({
				title: activeAlert?.title || '',
				message: activeAlert?.message,
				fromDate: activeAlert?.fromDate || defaultStartDate(new Date()).toISOString(),
				untilDate: activeAlert?.untilDate || defaultEndDate(new Date()).toISOString(),
				userGroups: activeAlert?.userGroups || [],
				icon: activeAlert?.icon || '',
				active: activeAlert?.active || false,
			} as AlertFormState),
		[activeAlert]
	);

	// source of truth
	const [form, setForm] = useState<AlertFormState>(defaultValues);
	const [formMessage, setFormMessage] = useState<RichEditorState>();
	const {
		control,
		formState: { errors },
		handleSubmit,
		setValue,
	} = useForm<AlertFormState>({
		resolver: yupResolver(ALERTS_FORM_SCHEMA(tText)),
		defaultValues,
	});

	useEffect(() => {
		activeAlert &&
			setForm({
				title: activeAlert.title || defaultValues.title,
				message: activeAlert.message || defaultValues.message,
				userGroups: activeAlert.userGroups || defaultValues.userGroups,
				fromDate: activeAlert.fromDate || defaultValues.fromDate,
				untilDate: activeAlert.untilDate || defaultValues.untilDate,
				icon: activeAlert.icon || defaultValues.icon,
				active: activeAlert.active || defaultValues.active,
			});
		activeAlert && setFormMessage(undefined);
	}, [activeAlert, defaultValues, setForm]);

	useEffect(() => {
		setValue('title', form.title);
		setValue('message', form.message);
		setValue('fromDate', form.fromDate);
		setValue('untilDate', form.untilDate);
		setValue('userGroups', form.userGroups);
		setValue('icon', form.icon);
		setValue('active', form.active);
	}, [form, setValue]);

	// Actions
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

	// TODO: refetch

	const onClickSave = async (values: AlertFormState) => {
		setAction('save');

		if (activeAlert?.id) {
			try {
				await AlertsService.updateAlert(activeAlert.id, values);

				AdminConfigManager.getConfig().services.toastService.showToast({
					title: tText('react-admin/modules/alerts/views/alerts-overview___succes'),
					description: tText(
						'react-admin/modules/alerts/views/alerts-overview___het-aanpassen-van-de-melding-is-gelukt'
					),
					type: ToastType.SUCCESS,
				});
			} catch (err) {
				console.error(new CustomError('Failed to update alert', err));

				AdminConfigManager.getConfig().services.toastService.showToast({
					title: tText('react-admin/modules/alerts/views/alerts-overview___error'),
					description: tText(
						'react-admin/modules/alerts/views/alerts-overview___het-aanpassen-van-de-melding-is-mislukt'
					),
					type: ToastType.ERROR,
				});
			}
		} else {
			try {
				await AlertsService.insertAlert(values);

				AdminConfigManager.getConfig().services.toastService.showToast({
					title: tText('react-admin/modules/alerts/views/alerts-overview___succes'),
					description: tText(
						'react-admin/modules/alerts/views/alerts-overview___het-aanmaken-van-de-melding-is-gelukt'
					),
					type: ToastType.SUCCESS,
				});
			} catch (err) {
				console.error(new CustomError('Failed to create alert', err));

				AdminConfigManager.getConfig().services.toastService.showToast({
					title: tText('react-admin/modules/alerts/views/alerts-overview___error'),
					description: tText(
						'react-admin/modules/alerts/views/alerts-overview___het-aanmaken-van-de-melding-is-mislukt'
					),
					type: ToastType.ERROR,
				});
			}
		}

		onClose();
		getAlerts();
	};

	const onClickDelete = async () => {
		setAction('delete');

		if (!alertToDeleteId) {
			return;
		}

		try {
			await AlertsService.deleteAlert(alertToDeleteId);

			AdminConfigManager.getConfig().services.toastService.showToast({
				title: tText('react-admin/modules/alerts/views/alerts-overview___succes'),
				description: tText(
					'react-admin/modules/alerts/views/alerts-overview___het-verwijderen-van-de-melding-is-gelukt'
				),
				type: ToastType.SUCCESS,
			});
		} catch (err) {
			console.error(new CustomError('Failed to delete alert', err));

			AdminConfigManager.getConfig().services.toastService.showToast({
				title: tText('react-admin/modules/alerts/views/alerts-overview___error'),
				description: tText(
					'react-admin/modules/alerts/views/alerts-overview___het-verwijderen-van-de-melding-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}

		getAlerts();
	};

	const onClose = () => {
		setActiveAlert(null);
		setFormMessage(undefined);
		setAction(null);
	};

	const renderTitle = useMemo(() => {
		return (
			<FormControl
				id="new-alert-title"
				label={tHtml('react-admin/modules/alerts/views/alerts-overview___titel-melding')}
				errors={[errors.title?.message]}
			>
				<Controller
					name="title"
					control={control}
					render={({ field }) => (
						<TextInput
							{...field}
							value={form.title}
							id="new-alert-title"
							onChange={(e) => {
								const title = e.currentTarget.value;

								setForm((prev) => ({
									...prev,
									title,
								}));
							}}
						/>
					)}
				/>
			</FormControl>
		);
	}, [control, errors.title?.message, form.title, tHtml]);

	const renderMessage = useMemo(() => {
		return (
			<FormControl
				id="new-alert-message"
				label={tHtml('react-admin/modules/alerts/views/alerts-overview___beschrijving')}
				errors={[errors.message?.message]}
			>
				<Controller
					name="message"
					control={control}
					render={({ field }) => (
						<RichTextEditor
							onBlur={field.onBlur}
							onChange={(state) => {
								setFormMessage(state);
								setForm((prev) => ({
									...prev,
									message: state.toHTML(),
								}));
							}}
							state={formMessage}
							initialHtml={defaultValues.message}
							controls={RICH_TEXT_EDITOR_OPTIONS}
						></RichTextEditor>
					)}
				/>
			</FormControl>
		);
	}, [control, defaultValues.message, errors.message?.message, formMessage, tHtml]);

	const renderIcon = useMemo(() => {
		return (
			<FormControl
				id="new-alert-icon"
				label={tHtml(
					'react-admin/modules/alerts/views/alerts-overview___verduidelijkend-icoon'
				)}
				errors={[errors.icon?.message]}
			>
				<Controller
					name="icon"
					control={control}
					render={() => (
						<IconPicker
							options={GET_ADMIN_ICON_OPTIONS()}
							onChange={(option) => {
								const icon = get(option, 'value', '');
								setForm((prev) => ({
									...prev,
									icon,
								}));
							}}
							value={GET_ADMIN_ICON_OPTIONS().find(
								(option: ReactSelectOption<string>) => option.value === form.icon
							)}
						/>
					)}
				/>
			</FormControl>
		);
	}, [control, errors.icon?.message, form.icon, tHtml]);

	const renderUserGroup = useMemo(() => {
		return (
			<FormControl
				id="new-alert-user-group"
				label={tHtml(
					'react-admin/modules/alerts/views/alerts-overview___zichtbaar-voor-gebruikersgroep'
				)}
				errors={[errors.userGroups?.message]}
			>
				<Controller
					name="userGroups"
					control={control}
					render={() => (
						<CheckboxDropdownModal
							onChange={(values) => {
								setForm((prev) => ({
									...prev,
									userGroups: values,
								}));
							}}
							// Set default selected state
							options={alertUserGroups.map((option) => ({
								...option,
								checked: form.userGroups.includes(option.id),
							}))}
							label="Zichtbaar voor gebruikersgroep"
							id="new-alert-user-group"
						/>
					)}
				/>
			</FormControl>
		);
	}, [control, errors.userGroups?.message, form.userGroups, tHtml]);

	const renderFrom = useMemo(() => {
		return (
			<FormControl
				id="new-alert-from-date"
				label={tHtml('react-admin/modules/alerts/views/alerts-overview___zichtbaar-van')}
				errors={[errors.fromDate?.message]}
			>
				<Controller
					name="fromDate"
					control={control}
					render={({ field }) => (
						<>
							<Datepicker
								id="new-alert-from-date"
								locale={nlBE}
								minDate={defaultStartDate(new Date())}
								name={field.name}
								onBlur={field.onBlur}
								onChange={(fromDate) => {
									fromDate &&
										setForm((prev) => ({
											...prev,
											fromDate: fromDate.toISOString(),
										}));
								}}
								selected={new Date(form.fromDate)}
								dateFormat="PP"
								value={format(new Date(form.fromDate), 'PP', {
									locale: nlBE,
								})}
							/>

							<Timepicker
								showTimeSelect
								id="new-alert-from-time"
								maxTime={endOfDay(new Date(form.fromDate) || now)}
								minTime={startOfDay(new Date(form.fromDate) || now)}
								minDate={defaultStartDate(new Date())}
								name={field.name}
								onBlur={field.onBlur}
								onChange={(fromDate) => {
									fromDate &&
										setForm((prev) => ({
											...prev,
											fromDate: fromDate.toISOString(),
										}));
								}}
								selected={new Date(form.fromDate)}
								value={format(new Date(form.fromDate), 'HH:mm')}
							/>
						</>
					)}
				/>
			</FormControl>
		);
	}, [control, errors.fromDate?.message, form.fromDate, tHtml]);

	const renderUntil = useMemo(() => {
		return (
			<FormControl
				id="new-alert-until-date"
				label={tHtml('react-admin/modules/alerts/views/alerts-overview___zichtbaar-tot')}
				errors={[errors.untilDate?.message]}
			>
				<Controller
					name="untilDate"
					control={control}
					render={({ field }) => (
						<>
							<Datepicker
								id="new-alert-until-date"
								minDate={new Date(form.fromDate)}
								locale={nlBE}
								name={field.name}
								onBlur={field.onBlur}
								onChange={(untilDate) => {
									untilDate &&
										setForm((prev) => ({
											...prev,
											untilDate: untilDate.toISOString(),
										}));
								}}
								selected={
									isAfter(new Date(form.untilDate), new Date(form.fromDate))
										? new Date(form.untilDate)
										: new Date(form.fromDate)
								}
								dateFormat="PP"
								value={
									isAfter(new Date(form.untilDate), new Date(form.fromDate))
										? format(new Date(form.untilDate), 'PP', {
												locale: nlBE,
										  })
										: format(new Date(form.fromDate), 'PP', {
												locale: nlBE,
										  })
								}
							/>

							<Timepicker
								showTimeSelect
								id="new-alert-until-time"
								maxTime={endOfDay(new Date(form.untilDate) || now)}
								minTime={
									isSameDay(new Date(form.fromDate), new Date(form.untilDate))
										? add(new Date(form.fromDate), { minutes: 30 })
										: startOfDay(new Date(form.untilDate) || now)
								}
								minDate={new Date(form.fromDate)}
								name={field.name}
								onBlur={field.onBlur}
								onChange={(untilDate) => {
									untilDate &&
										setForm((prev) => ({
											...prev,
											untilDate: untilDate.toISOString(),
										}));
								}}
								selected={
									isAfter(
										new Date(form.untilDate),
										add(new Date(form.fromDate), { minutes: 30 })
									)
										? new Date(form.untilDate)
										: add(new Date(form.fromDate), { minutes: 30 })
								}
								value={
									isAfter(
										new Date(form.untilDate),
										add(new Date(form.fromDate), { minutes: 30 })
									)
										? format(new Date(form.untilDate), 'HH:mm')
										: format(
												add(new Date(form.fromDate), { minutes: 30 }),
												'HH:mm'
										  )
								}
							/>
						</>
					)}
				/>
			</FormControl>
		);
	}, [control, errors.untilDate?.message, form.fromDate, form.untilDate, tHtml]);

	// Show modal/blade
	const renderPopupBody = () => {
		if (!activeAlert) {
			return;
		}

		return (
			<>
				{renderTitle}
				{renderMessage}
				{renderIcon}
				{renderUserGroup}
				{renderFrom}
				{renderUntil}
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
						action === 'create'
							? 'react-admin/modules/alerts/views/alerts-overview___melding-aanmaken'
							: 'react-admin/modules/alerts/views/alerts-overview___melding-aanpassen'
					),
					body: renderPopupBody(),
					isOpen: !!activeAlert,
					onSave: handleSubmit(onClickSave),
					onClose: onClose,
				})}
				<ConfirmModal
					deleteObjectCallback={onClickDelete}
					body={tHtml(
						'react-admin/modules/alerts/views/alerts-overview___het-verwijderen-van-een-melding-kan-niet-ongedaan-gemaakt-worden'
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

export default AlertsOverview as FunctionComponent<AlertsOverviewProps>;
