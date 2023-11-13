import {
	Badge,
	Button,
	FormControl,
	MultiSelect,
	type MultiSelectOption,
	Pagination,
	RichEditorState,
	RichTextEditor,
	Row,
	Table,
	TableOptions,
	TextInput,
} from '@meemoo/react-components';
import { IPagination } from '@studiohyperdrive/pagination';
import type { Avo } from '@viaa/avo2-types';
import { Pagination as PaginationAvo } from '@viaa/avo2-components';

import { yupResolver } from '@hookform/resolvers/yup';

import { format, isAfter, isWithinInterval, parseISO } from 'date-fns';
import { FunctionComponent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQueryParams } from 'use-query-params';
import { datePickerDefaultProps } from '~modules/content-page/components/DatePicker/DatePicker.consts';
import { Icon, Loader } from '~modules/shared/components';
import Html from '~modules/shared/components/Html/Html';
import { IconPicker } from '~modules/shared/components/IconPicker/IconPicker';
import { sortingIcons } from '~modules/shared/components/Table/Table.const';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { useTranslation } from '~modules/shared/hooks/useTranslation';
import { AdminLayout } from '~modules/shared/layouts';
import { useUserGroupOptions } from '~modules/user-group/hooks/useUserGroupOptions';
import { DateInput } from '~shared/components/DateInput/DateInput';
import timepicker from '~shared/components/Timepicker/Timepicker';
import Timepicker from '~shared/components/Timepicker/Timepicker';
import { timePickerDefaults } from '~shared/components/Timepicker/Timepicker.consts';
import { OrderDirection } from '~shared/types';
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
import { isNil, without } from 'lodash-es';
import nlBE from 'date-fns/locale/nl-BE/index.js';
import ConfirmModal from '~modules/shared/components/ConfirmModal/ConfirmModal';
import { AdminConfigManager, ToastType } from '~core/config';
import { isAvo } from '~modules/shared/helpers/is-avo';

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
		(orderProp: string | undefined, orderDirection: OrderDirection | undefined) => {
			setFilters((prev) => ({
				...prev,
				orderProp,
				orderDirection,
			}));
		},
		[setFilters]
	);

	const [userGroupOptions] = useUserGroupOptions('MultiSelectOption', true, false);

	useEffect(() => {
		getAlerts();
	}, [getAlerts]);

	const checkIsAlertActive = (from: string, till: string): boolean => {
		if (!isAfter(parseISO(till), parseISO(from))) {
			return false;
		}

		return isWithinInterval(new Date(), {
			start: parseISO(from),
			end: parseISO(till),
		});
	};

	const sortByInfo = useMemo(
		() => [
			{
				id: filters.orderProp ?? 'fromDate',
				desc: filters.orderDirection !== 'asc',
			},
		],
		[filters]
	);

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
													parseISO(row.original.fromDate),
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
													parseISO(row.original.untilDate),
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
								sortBy: sortByInfo,
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

	const getDefaultValues = useCallback(() => {
		const now = new Date();
		return {
			title: activeAlert?.title || '',
			message: activeAlert?.message || '',
			fromDate: activeAlert?.fromDate
				? new Date(activeAlert?.fromDate + 'Z') // Force date to be interpreted as a GMT time from the database => parse it as a Europe/Brussels time in the date object
				: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0),
			untilDate: activeAlert?.untilDate
				? new Date(activeAlert?.untilDate + 'Z')
				: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59),
			userGroups: activeAlert?.userGroups || [],
			type: activeAlert?.type || '',
		} as AlertFormState;
	}, [activeAlert]);

	const [form, setForm] = useState<AlertFormState>(getDefaultValues());
	const [formMessage, setFormMessage] = useState<RichEditorState>();
	const {
		control,
		formState: { errors },
		handleSubmit,
		setValue,
		reset,
	} = useForm<AlertFormState>({
		resolver: yupResolver(ALERTS_FORM_SCHEMA(tText)),
		defaultValues: getDefaultValues(),
	});

	useEffect(() => {
		activeAlert && setForm(getDefaultValues());
		activeAlert && setFormMessage(undefined);
	}, [activeAlert, getDefaultValues, setForm]);

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
				await AlertsService.updateAlert(activeAlert.id, {
					...values,
					fromDate: values.fromDate.toUTCString(),
					untilDate: values.untilDate.toUTCString(),
				});

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
	};

	useEffect(() => {
		if (isNil(activeAlert)) {
			// Reset the form when the blade is closed
			reset(getDefaultValues());
		}
	}, [activeAlert, getDefaultValues, reset]);

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
							initialHtml={getDefaultValues().message}
							controls={RICH_TEXT_EDITOR_OPTIONS}
						></RichTextEditor>
					)}
				/>
			</FormControl>
		);
	}, [control, getDefaultValues, errors.message?.message, formMessage, tHtml]);

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
								const type: string | null =
									(option as { key: string; value: string })?.key ?? null;

								setForm((prev) => ({
									...prev,
									type,
								}));
							}}
							value={
								GET_ALERTS_ICON_OPTIONS().find(
									(option) => option.key === form.type
								) ?? null
							}
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
				errors={[<>{errors.userGroups?.message}</>]}
			>
				<Controller
					name="userGroups"
					control={control}
					render={() => (
						<MultiSelect
							options={(userGroupOptions as MultiSelectOption[]).map((option) => ({
								...option,
								checked: form.userGroups.includes(option.id),
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
		errors.userGroups,
		form.userGroups,
		handleChangeUserGroups,
		tHtml,
		tText,
		userGroupOptions,
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
							<DateInput
								{...datePickerDefaultProps}
								id="new-alert-from-date"
								name={field.name}
								onBlur={field.onBlur}
								onChange={(newFromDate: Date) => {
									if (newFromDate) {
										const oldFromDate = form.fromDate;
										setForm((prev) => ({
											...prev,
											fromDate: new Date(
												newFromDate.getFullYear(),
												newFromDate.getMonth(),
												newFromDate.getDate(),
												oldFromDate.getHours(),
												oldFromDate.getMinutes()
											),
										}));
									}
								}}
								selected={field.value}
								value={format(form.fromDate, 'PP', {
									locale: nlBE,
								})}
							/>

							<Timepicker
								{...timePickerDefaults}
								id="new-alert-from-time"
								name={field.name}
								onBlur={field.onBlur}
								onChange={(newFromTime: Date) => {
									if (newFromTime) {
										const oldFromDate = form.fromDate;
										setForm((prev) => ({
											...prev,
											fromDate: new Date(
												oldFromDate.getFullYear(),
												oldFromDate.getMonth(),
												oldFromDate.getDate(),
												newFromTime.getHours(),
												newFromTime.getMinutes()
											),
										}));
									}
								}}
								value={format(form.fromDate, 'HH:mm', {
									locale: nlBE,
								})}
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
							<DateInput
								{...datePickerDefaultProps}
								id="new-alert-until-date"
								name={field.name}
								onBlur={field.onBlur}
								onChange={(newUntilDate: Date) => {
									if (newUntilDate) {
										const oldUntilDate = form.untilDate;
										setForm((prev) => ({
											...prev,
											untilDate: new Date(
												newUntilDate.getFullYear(),
												newUntilDate.getMonth(),
												newUntilDate.getDate(),
												oldUntilDate.getHours(),
												oldUntilDate.getMinutes()
											),
										}));
									}
								}}
								selected={field.value}
								value={format(form.untilDate, 'PP', {
									locale: nlBE,
								})}
							/>

							<Timepicker
								{...timePickerDefaults}
								id="new-alert-until-time"
								name={field.name}
								onBlur={field.onBlur}
								onChange={(newUntilTime: Date) => {
									if (newUntilTime) {
										const oldUntilDate = form.untilDate;
										setForm((prev) => ({
											...prev,
											untilDate: new Date(
												oldUntilDate.getFullYear(),
												oldUntilDate.getMonth(),
												oldUntilDate.getDate(),
												newUntilTime.getHours(),
												newUntilTime.getMinutes()
											),
										}));
									}
								}}
								value={format(form.untilDate, 'HH:mm', {
									locale: nlBE,
								})}
							/>
						</>
					)}
				/>
			</FormControl>
		);
	}, [control, errors.untilDate?.message, form.untilDate, tHtml]);

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
