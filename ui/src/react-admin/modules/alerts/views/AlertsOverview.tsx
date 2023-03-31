import {
	Badge,
	Button,
	Datepicker,
	FormControl,
	futureDatepicker,
	MultiSelect,
	Pagination,
	RichEditorState,
	RichTextEditor,
	Row,
	Table,
	TableOptions,
	TextInput,
	Timepicker,
	timepicker,
} from '@meemoo/react-components';
import { IPagination } from '@studiohyperdrive/pagination';
import { Avo } from '@viaa/avo2-types';
import { Pagination as PaginationAvo } from '@viaa/avo2-components';

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
import { Icon, Loader } from '~modules/shared/components';
import Html from '~modules/shared/components/Html/Html';
import { IconPicker } from '~modules/shared/components/IconPicker/IconPicker';
import { sortingIcons } from '~modules/shared/components/Table/Table.const';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { useTranslation } from '~modules/shared/hooks/useTranslation';
import { AdminLayout } from '~modules/shared/layouts';
import {
	ALERTS_FORM_SCHEMA,
	ALERTS_PER_PAGE,
	ALERTS_QUERY_PARAM_CONFIG,
	GET_ALERTS_ICON_OPTIONS,
	RICH_TEXT_EDITOR_OPTIONS,
} from '../alerts.const';
import { AlertsService } from '../alerts.service';
import {
	Alert,
	AlertFormState,
	AlertsOverviewProps,
	AlertsOverviewTableCol,
} from '../alerts.types';
import { get, now, without } from 'lodash-es';
import { nlBE } from 'date-fns/locale';
import ConfirmModal from '~modules/shared/components/ConfirmModal/ConfirmModal';
import { AdminConfigManager, ToastType } from '~core/config';
import { isAvo } from '~modules/shared/helpers/is-avo';
import { useGetUserGroups } from '~modules/user-group/hooks/get-user-groups';

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

	const pageCount: number = Math.ceil(alerts?.pages || 1 / ALERTS_PER_PAGE);

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
	}, [filters.orderProp, filters.orderDirection, filters.page, tText]);

	const handleSortChange = useCallback(
		(orderProp, orderDirection) => {
			setFilters((prev) => ({
				...prev,
				orderProp,
				orderDirection,
			}));
		},
		[setFilters]
	);

	const { data: userGroups } = useGetUserGroups({ withPermissions: false });

	useEffect(() => {
		getAlerts();
	}, [getAlerts]);

	const checkIsAlertActive = (from: string, till: string): boolean => {
		if (!isAfter(new Date(till), new Date(from))) {
			return false;
		}

		return isWithinInterval(new Date(), {
			start: new Date(from),
			end: new Date(till),
		});
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
												text={
													checkIsAlertActive(
														row.original.fromDate,
														row.original.untilDate
													)
														? tText(
																'modules/alerts/views/alerts-overview___actief'
														  )
														: tText(
																'modules/alerts/views/alerts-overview___inactief'
														  )
												}
												variants={
													checkIsAlertActive(
														row.original.fromDate,
														row.original.untilDate
													)
														? ['success']
														: ['grey']
												}
											/>
										);
									},
								},
								{
									id: 'actions',
									Header: '',
									Cell: ({ row }: { row: Row<Alert> }) => {
										return (
											<>
												<Button
													icon={<Icon name="edit" />}
													className="u-color-neutral"
													variants="text"
													onClick={() => {
														setActiveAlert(row.original);
														setAction('edit');
													}}
												/>
												<Button
													icon={<Icon name="delete" />}
													className="u-color-neutral"
													variants="text"
													onClick={() => {
														setAlertToDeleteId(row.original.id);
														setIsDeleteModalOpen(true);
													}}
												/>
											</>
										);
									},
								},
							],
							data: alerts.items || [],
							initialState: {
								pageSize: 10,
							},
						} as TableOptions<any>
					}
					onSortChange={handleSortChange}
					sortingIcons={sortingIcons}
					pagination={getPagination}
				/>
			</>
		);
	};

	const getPagination = () => {
		if (!isAvo()) {
			return (
				<Pagination
					buttons={{
						next: (
							<Button
								className="u-pl-24:sm u-pl-8"
								disabled={filters.page === pageCount}
								variants={['text', 'neutral']}
								label={tHtml(
									'modules/shared/components/pagination-bar/pagination-bar___volgende'
								)}
								iconEnd={<Icon name="angleRight" />}
							/>
						),
						previous: (
							<Button
								className="u-pr-24:sm u-pr-8"
								disabled={filters.page === 1}
								variants={['text', 'neutral']}
								label={tHtml(
									'modules/shared/components/pagination-bar/pagination-bar___vorige'
								)}
								iconStart={<Icon name="angleLeft" />}
							/>
						),
					}}
					showFirstLastNumbers
					onPageChange={handlePageChange}
					currentPage={filters.page - 1}
					pageCount={pageCount}
				/>
			);
		} else {
			return (
				<PaginationAvo
					pageCount={pageCount}
					onPageChange={handlePageChange}
					currentPage={filters.page - 1}
				/>
			);
		}
	};

	const handlePageChange = (newPageZeroBased: number) => {
		setFilters((prev) => ({
			...prev,
			page: newPageZeroBased + 1,
		}));
	};

	const handleChangeUserGroups = useCallback((checked: boolean, id: string) => {
		setForm((prev) => ({
			...prev,
			userGroups: !checked ? [...prev.userGroups, id] : without(prev.userGroups, id),
		}));
	}, []);

	const defaultValues = useMemo(
		() =>
			({
				title: activeAlert?.title || '',
				message: activeAlert?.message,
				fromDate: activeAlert?.fromDate || defaultStartDate(new Date()).toISOString(),
				untilDate: activeAlert?.untilDate || defaultEndDate(new Date()).toISOString(),
				userGroups: activeAlert?.userGroups || [],
				type: activeAlert?.type || '',
			} as AlertFormState),
		[activeAlert]
	);

	const [form, setForm] = useState<AlertFormState>(defaultValues);
	const [formMessage, setFormMessage] = useState<RichEditorState>();
	const {
		control,
		formState: { errors },
		handleSubmit,
		setValue,
		reset,
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
				type: activeAlert.type || defaultValues.type,
			});
		activeAlert && setFormMessage(undefined);
	}, [activeAlert, defaultValues, setForm]);

	useEffect(() => {
		setValue('title', form.title);
		setValue('message', form.message);
		setValue('fromDate', form.fromDate);
		setValue('untilDate', form.untilDate);
		setValue('userGroups', form.userGroups);
		setValue('type', form.type);
	}, [form, setValue]);

	// Actions
	const onClickCreate = () => {
		setAction('create');
		setActiveAlert({
			id: '',
			title: '',
			message: '',
			type: '',
			userGroups: [],
			fromDate: '',
			untilDate: '',
		});
	};

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
		setAction(null);
		setActiveAlert(null);
		setFormMessage(undefined);
		reset();
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
				errors={[errors.type?.message]}
			>
				<Controller
					name="type"
					control={control}
					render={() => (
						<IconPicker
							options={GET_ALERTS_ICON_OPTIONS()}
							onChange={(option) => {
								const type: string = get(option, 'key', '');

								setForm((prev) => ({
									...prev,
									type,
								}));
							}}
							value={GET_ALERTS_ICON_OPTIONS().find(
								(option) => option.key === form.type
							)}
						/>
					)}
				/>
			</FormControl>
		);
	}, [control, errors.type?.message, form.type, tHtml]);

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
						<MultiSelect
							options={(userGroups || []).map((userGroup) => ({
								...userGroup,
								checked: form.userGroups.includes(userGroup.id),
							}))}
							onChange={handleChangeUserGroups}
							label={tText(
								'react-admin/modules/alerts/views/alerts-overview___zichtbaar-voor-gebruikersgroep'
							)}
							iconOpen={<Icon name="angleUp" />}
							iconClosed={<Icon name="angleDown" />}
							iconCheck={<Icon name="check" />}
						/>
					)}
				/>
			</FormControl>
		);
	}, [
		control,
		errors.userGroups?.message,
		form.userGroups,
		handleChangeUserGroups,
		tHtml,
		tText,
		userGroups,
	]);

	const renderFrom = useMemo(() => {
		return (
			<FormControl
				id="new-alert-from-date"
				label={tHtml('react-admin/modules/alerts/views/alerts-overview___zichtbaar-van')}
				errors={[errors.fromDate?.message]}
				className="c-input--date-time"
			>
				<Controller
					name="fromDate"
					control={control}
					render={({ field }) => (
						<>
							<Datepicker
								customInput={<TextInput iconStart={<Icon name="calendar" />} />}
								id="new-alert-from-date"
								locale={nlBE}
								minDate={defaultStartDate(new Date())}
								name={field.name}
								onBlur={field.onBlur}
								onChange={(fromDate: Date) => {
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
								{...timepicker}
								customInput={<TextInput iconStart={<Icon name="clock" />} />}
								showTimeSelect
								id="new-alert-from-time"
								maxTime={endOfDay(new Date(form.fromDate) || now)}
								minTime={startOfDay(new Date(form.fromDate) || now)}
								minDate={defaultStartDate(new Date())}
								name={field.name}
								onBlur={field.onBlur}
								onChange={(fromDate: Date) => {
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
				className="c-input--date-time"
			>
				<Controller
					name="untilDate"
					control={control}
					render={({ field }) => (
						<>
							<Datepicker
								{...futureDatepicker}
								customInput={<TextInput iconStart={<Icon name="calendar" />} />}
								id="new-alert-until-date"
								name={field.name}
								onBlur={field.onBlur}
								onChange={(untilDate: Date) => {
									untilDate &&
										setForm((prev) => ({
											...prev,
											untilDate: untilDate.toISOString(),
										}));
								}}
								selected={new Date(field.value)}
								value={format(new Date(form.untilDate), 'PP', {
									locale: nlBE,
								})}
								popperPlacement="bottom-start"
							/>
							{/*<Datepicker*/}
							{/*	customInput={*/}
							{/*		// TODO: icon name*/}
							{/*		<TextInput*/}
							{/*			iconStart={*/}
							{/*				Icon && (*/}
							{/*					<Icon*/}
							{/*						{...(AdminConfigManager.getConfig().icon*/}
							{/*							?.componentProps.calendar as {*/}
							{/*							name: string;*/}
							{/*						})}*/}
							{/*					/>*/}
							{/*				)*/}
							{/*			}*/}
							{/*		/>*/}
							{/*	}*/}
							{/*	id="new-alert-until-date"*/}
							{/*	minDate={new Date(form.fromDate)}*/}
							{/*	locale={nlBE}*/}
							{/*	name={field.name}*/}
							{/*	onBlur={field.onBlur}*/}
							{/*	onChange={(untilDate: Date) => {*/}
							{/*		untilDate &&*/}
							{/*			setForm((prev) => ({*/}
							{/*				...prev,*/}
							{/*				untilDate: untilDate.toISOString(),*/}
							{/*			}));*/}
							{/*	}}*/}
							{/*	selected={*/}
							{/*		isAfter(new Date(form.untilDate), new Date(form.fromDate))*/}
							{/*			? new Date(form.untilDate)*/}
							{/*			: new Date(form.fromDate)*/}
							{/*	}*/}
							{/*	dateFormat="PP"*/}
							{/*	value={*/}
							{/*		isAfter(new Date(form.untilDate), new Date(form.fromDate))*/}
							{/*			? format(new Date(form.untilDate), 'PP', {*/}
							{/*					locale: nlBE,*/}
							{/*			  })*/}
							{/*			: format(new Date(form.fromDate), 'PP', {*/}
							{/*					locale: nlBE,*/}
							{/*			  })*/}
							{/*	}*/}
							{/*/>*/}

							<Timepicker
								{...timepicker}
								customInput={<TextInput iconStart={<Icon name="clock" />} />}
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
								onChange={(untilDate: Date) => {
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
					iconStart={<Icon name="export" />}
					label={tText(
						'react-admin/modules/alerts/views/alerts-overview___nieuwe-melding-aanmaken'
					)}
					onClick={() => onClickCreate()}
					variants="black"
				/>
			</AdminLayout.Actions>

			<AdminLayout.Content>
				<div className={className}>{alerts && renderAlertsTable(alerts)}</div>

				{renderPopup({
					title:
						action === 'create'
							? tText(
									'react-admin/modules/alerts/views/alerts-overview___melding-aanmaken'
							  )
							: tText(
									'react-admin/modules/alerts/views/alerts-overview___melding-aanpassen'
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
