import { yupResolver } from '@hookform/resolvers/yup';
import {
	FormControl,
	MultiSelect,
	type MultiSelectOption,
	ReactSelect,
	RichTextEditorWithInternalState,
	SelectOption,
	TextInput,
} from '@meemoo/react-components';

import { format } from 'date-fns';
import nlBE from 'date-fns/locale/nl-BE/index.js';
import { isNil, without } from 'lodash-es';
import { FunctionComponent, useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AdminConfigManager, ToastType } from '~core/config';
import { datePickerDefaultProps } from '~modules/content-page/components/DatePicker/DatePicker.consts';
import { MaintenanceAlertsService } from '~modules/maintenance-alerts/maintenance-alerts.service';
import { MaintenanceAlertsEditFormProps } from '~modules/maintenance-alerts/maintenance-alerts.types';
import { Icon } from '~modules/shared/components';
import { IconPicker } from '~modules/shared/components/IconPicker/IconPicker';
import { useGetAllLanguages } from '~modules/translations/hooks/use-get-all-languages';
import { LanguageCode } from '~modules/translations/translations.core.types';
import { LanguageInfo } from '~modules/translations/translations.types';
import { useUserGroupOptions } from '~modules/user-group/hooks/useUserGroupOptions';
import { DateInput } from '~shared/components/DateInput/DateInput';
import Timepicker from '~shared/components/Timepicker/Timepicker';
import { timePickerDefaults } from '~shared/components/Timepicker/Timepicker.consts';
import { CustomError } from '~shared/helpers/custom-error';
import { parseAsIsoWithoutTimezone } from '~shared/helpers/formatters/date';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import {
	ALERTS_FORM_SCHEMA,
	GET_ALERTS_ICON_OPTIONS,
	RICH_TEXT_EDITOR_OPTIONS,
} from '../maintenance-alerts.const';
import { MaintenanceAlertFormState } from '../maintenance-alerts.types';

const MaintenanceAlertsEditForm: FunctionComponent<MaintenanceAlertsEditFormProps> = ({
	maintenanceAlert,
	action,
	renderPopup,
	onClose,
}) => {
	const [userGroupOptions] = useUserGroupOptions('MultiSelectOption', true, false);

	const getDefaultValues = useCallback(() => {
		const now = new Date();
		return {
			title: maintenanceAlert?.title || '',
			message: maintenanceAlert?.message || '',
			fromDate: maintenanceAlert?.fromDate
				? parseAsIsoWithoutTimezone(maintenanceAlert?.fromDate)
				: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0),
			untilDate: maintenanceAlert?.untilDate
				? parseAsIsoWithoutTimezone(maintenanceAlert?.untilDate)
				: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59),
			userGroups: maintenanceAlert?.userGroups || [],
			type: maintenanceAlert?.type || '',
			language: maintenanceAlert?.language || LanguageCode.Nl,
		} as MaintenanceAlertFormState;
	}, [maintenanceAlert]);

	// const [form, setForm] = useState<MaintenanceAlertFormState>(getDefaultValues());
	const {
		control,
		formState: { errors },
		handleSubmit,
		setValue,
		reset,
	} = useForm<MaintenanceAlertFormState>({
		resolver: yupResolver(ALERTS_FORM_SCHEMA(tText)),
		defaultValues: getDefaultValues(),
	});

	const { data: allLanguages } = useGetAllLanguages();

	const languageOptions = (allLanguages || []).map(
		(languageInfo: LanguageInfo): SelectOption => ({
			value: languageInfo.languageCode,
			label: languageInfo.languageLabel,
		})
	);

	useEffect(() => {
		maintenanceAlert && reset(getDefaultValues());
	}, [maintenanceAlert, getDefaultValues, reset]);

	// useEffect(() => {
	// 	setValue('title', form.title);
	// 	setValue('message', form.message);
	// 	setValue('fromDate', form.fromDate);
	// 	setValue('untilDate', form.untilDate);
	// 	setValue('userGroups', form.userGroups);
	// 	setValue('type', form.type);
	// 	setValue('language', form.language);
	// }, [form, setValue]);

	useEffect(() => {
		if (isNil(maintenanceAlert)) {
			// Reset the form when the blade is closed
			reset(getDefaultValues());
		}
	}, [maintenanceAlert, getDefaultValues, reset]);

	const handleClose = () => {
		reset(getDefaultValues());
		setValue('message', '');
		onClose();
	};

	const onClickSave = async (values: MaintenanceAlertFormState) => {
		if (maintenanceAlert?.id) {
			try {
				await MaintenanceAlertsService.updateAlert(maintenanceAlert.id, {
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
				await MaintenanceAlertsService.insertAlert(values);

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

		handleClose();
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
							value={field.value}
							id="new-alert-title"
							onChange={(e) => {
								const title = e.currentTarget.value;
								setValue('title', title);
							}}
						/>
					)}
				/>
			</FormControl>
		);
	}, [control, errors.title?.message]);

	const renderMessage = useMemo(() => {
		return (
			<FormControl
				id="new-alert-message"
				label={tHtml('react-admin/modules/alerts/views/alerts-overview___beschrijving')}
				errors={[errors.message?.message]}
			>
				{!!maintenanceAlert && (
					<Controller
						name="message"
						control={control}
						render={({ field }) => (
							<RichTextEditorWithInternalState
								onBlur={field.onBlur}
								onChange={(newMessage) => {
									setValue('message', newMessage);
								}}
								value={field.value}
								initialHtml={getDefaultValues().message}
								controls={RICH_TEXT_EDITOR_OPTIONS}
							></RichTextEditorWithInternalState>
						)}
					/>
				)}
			</FormControl>
		);
	}, [errors.message?.message, maintenanceAlert, control, getDefaultValues, setValue]);

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
					render={({ field }) => (
						<IconPicker
							options={GET_ALERTS_ICON_OPTIONS()}
							onChange={(option) => {
								const type: string | null =
									(option as { key: string; value: string })?.key ?? null;

								setValue('type', type);
							}}
							value={
								GET_ALERTS_ICON_OPTIONS().find(
									(option) => option.key === field.value
								) ?? null
							}
						/>
					)}
				/>
			</FormControl>
		);
	}, [control, errors.type?.message, setValue]);

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
					render={({ field }) => (
						<MultiSelect
							options={(userGroupOptions as MultiSelectOption[]).map((option) => ({
								...option,
								checked: field.value.includes(option.id),
							}))}
							onChange={(checked: boolean, id: string) => {
								setValue(
									'userGroups',
									!checked ? [...field.value, id] : without(field.value, id)
								);
							}}
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
	}, [control, errors.userGroups?.message, setValue, userGroupOptions]);

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
										const oldFromDate = field.value;
										setValue(
											'fromDate',
											new Date(
												newFromDate.getFullYear(),
												newFromDate.getMonth(),
												newFromDate.getDate(),
												oldFromDate.getHours(),
												oldFromDate.getMinutes()
											)
										);
									}
								}}
								selected={field.value}
							/>

							<Timepicker
								{...timePickerDefaults}
								id="new-alert-from-time"
								name={field.name}
								onBlur={field.onBlur}
								onChange={(newFromTime: Date) => {
									if (newFromTime) {
										const oldFromDate = field.value;
										setValue(
											'fromDate',
											new Date(
												oldFromDate.getFullYear(),
												oldFromDate.getMonth(),
												oldFromDate.getDate(),
												newFromTime.getHours(),
												newFromTime.getMinutes()
											)
										);
									}
								}}
								value={format(field.value, 'HH:mm', {
									locale: nlBE,
								})}
							/>
						</>
					)}
				/>
			</FormControl>
		);
	}, [control, errors.fromDate?.message, setValue]);

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
										const oldUntilDate = field.value;
										setValue(
											'untilDate',
											new Date(
												newUntilDate.getFullYear(),
												newUntilDate.getMonth(),
												newUntilDate.getDate(),
												oldUntilDate.getHours(),
												oldUntilDate.getMinutes()
											)
										);
									}
								}}
								selected={field.value}
							/>

							<Timepicker
								{...timePickerDefaults}
								id="new-alert-until-time"
								name={field.name}
								onBlur={field.onBlur}
								onChange={(newUntilTime: Date) => {
									if (newUntilTime) {
										const oldUntilDate = field.value;
										setValue(
											'untilDate',
											new Date(
												oldUntilDate.getFullYear(),
												oldUntilDate.getMonth(),
												oldUntilDate.getDate(),
												newUntilTime.getHours(),
												newUntilTime.getMinutes()
											)
										);
									}
								}}
								value={format(field.value, 'HH:mm', {
									locale: nlBE,
								})}
							/>
						</>
					)}
				/>
			</FormControl>
		);
	}, [control, errors.untilDate?.message, setValue]);

	const renderLanguage = useMemo(() => {
		return (
			<FormControl
				id="new-alert-language"
				label={tHtml('Taal')}
				errors={[errors.language?.message]}
			>
				<Controller
					name="type"
					control={control}
					render={({ field }) => (
						<ReactSelect
							options={languageOptions}
							onChange={(option) => {
								const language: LanguageCode | null = ((
									option as { label: string; value: string }
								)?.value ?? LanguageCode.Nl) as LanguageCode;

								setValue('language', language);
							}}
							value={
								languageOptions.find((option) => option.value === field.value) ||
								languageOptions.find((option) => option.value === LanguageCode.Nl)
							}
						/>
					)}
				/>
			</FormControl>
		);
	}, [control, errors.language?.message, languageOptions, setValue]);

	const renderPopupBody = () => {
		if (!maintenanceAlert) {
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
				{renderLanguage}
			</>
		);
	};

	return renderPopup({
		title:
			action === 'create'
				? tText('react-admin/modules/alerts/views/alerts-overview___melding-aanmaken')
				: tText('react-admin/modules/alerts/views/alerts-overview___melding-aanpassen'),
		body: renderPopupBody(),
		isOpen: !!maintenanceAlert,
		onSave: handleSubmit(onClickSave),
		onClose: handleClose,
	});
};

export default MaintenanceAlertsEditForm as FunctionComponent<MaintenanceAlertsEditFormProps>;
