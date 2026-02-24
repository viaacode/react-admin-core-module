import type { MultiSelectOption, SelectOption } from '@meemoo/react-components';
import {
	FormControl,
	MultiSelect,
	ReactSelect,
	RichTextEditorWithInternalState,
	TextInput,
} from '@meemoo/react-components';
import { format } from 'date-fns';
import { nlBE } from 'date-fns/locale';
import { without } from 'es-toolkit';
import type { FunctionComponent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import { ValidationError } from 'yup';
import { ToastType } from '~core/config/config.types';
import { getDatePickerDefaultProps } from '~modules/content-page/components/DatePicker/DatePicker.consts';
import { MaintenanceAlertsService } from '~modules/maintenance-alerts/maintenance-alerts.service';
import type {
	MaintenanceAlert,
	MaintenanceAlertDto,
	MaintenanceAlertsEditFormProps,
} from '~modules/maintenance-alerts/maintenance-alerts.types';
import { IconPicker } from '~modules/shared/components/IconPicker/IconPicker';
import { useGetAllLanguages } from '~modules/translations/hooks/use-get-all-languages';
import { App, Locale } from '~modules/translations/translations.core.types';
import type { LanguageInfo } from '~modules/translations/translations.types';
import { useUserGroupOptions } from '~modules/user-group/hooks/useUserGroupOptions';
import { Icon } from '~shared/components/Icon/Icon';
import { Timepicker } from '~shared/components/Timepicker/Timepicker';
import { getTimePickerDefaults } from '~shared/components/Timepicker/Timepicker.consts';
import { GET_LANGUAGE_NAMES } from '~shared/consts/language-names';
import { CustomError } from '~shared/helpers/custom-error';
import { parseAsIsoWithoutTimezone } from '~shared/helpers/formatters/date';
import { isMultiLanguageEnabled } from '~shared/helpers/is-multi-language-enabled';
import { showToast } from '~shared/helpers/show-toast';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import {
	ALERTS_FORM_SCHEMA,
	GET_ALERTS_ICON_OPTIONS,
	RICH_TEXT_EDITOR_OPTIONS,
} from '../maintenance-alerts.const';

const MaintenanceAlertsEditForm: FunctionComponent<MaintenanceAlertsEditFormProps> = ({
	maintenanceAlert,
	action,
	renderPopup,
	onClose,
}) => {
	const [userGroupOptions] = useUserGroupOptions('MultiSelectOption', true, false);

	const { data: allLanguages } = useGetAllLanguages();

	const [currentMaintenanceAlert, setCurrentMaintenanceAlert] =
		useState<Partial<MaintenanceAlert> | null>(maintenanceAlert);
	const [errors, setErrors] = useState<Partial<Record<keyof MaintenanceAlert, string>>>({});

	const languageOptions = (allLanguages || []).map(
		(languageInfo: LanguageInfo): SelectOption => ({
			value: languageInfo.languageCode,
			label: GET_LANGUAGE_NAMES()[languageInfo.languageCode],
		})
	);

	const updateFormState = useCallback(() => {
		setCurrentMaintenanceAlert({
			...(maintenanceAlert || {}),
			fromDate: maintenanceAlert?.fromDate
				? parseAsIsoWithoutTimezone(maintenanceAlert.fromDate).toISOString()
				: undefined,
			untilDate: maintenanceAlert?.untilDate
				? parseAsIsoWithoutTimezone(maintenanceAlert.untilDate).toISOString()
				: undefined,
		});
	}, [maintenanceAlert]);

	useEffect(() => {
		updateFormState();
	}, [updateFormState]);

	const handleClose = () => {
		onClose();
		updateFormState();
	};

	const isFormValid = useCallback((): boolean => {
		try {
			// Attempt to validate the currentMaintenanceAlert object against the schema
			ALERTS_FORM_SCHEMA().validateSync(currentMaintenanceAlert);
			// If validation is successful, you might want to clear any existing errors
			setErrors({});
			return true;
		} catch (error) {
			if (error instanceof ValidationError) {
				const path = error.path as string;
				const message = error.message as string;
				setErrors({ [path]: message });
			} else {
				// Handle unexpected errors (not related to validation)
				showToast({
					title: tText(
						'modules/maintenance-alerts/views/maintenance-alerts-edit-form___error',
						{},
						[App.HET_ARCHIEF]
					),
					description: tText(
						'modules/maintenance-alerts/views/maintenance-alerts-edit-form___het-valideren-van-het-formulier-is-mislukt',
						{},
						[App.HET_ARCHIEF]
					),
					type: ToastType.ERROR,
				});
			}
			return false;
		}
	}, [currentMaintenanceAlert]);

	const onClickSave = async () => {
		if (!currentMaintenanceAlert) {
			showToast({
				title: tText('modules/maintenance-alerts/views/maintenance-alerts-edit-form___error', {}, [
					App.HET_ARCHIEF,
				]),
				description: tText(
					'modules/maintenance-alerts/views/maintenance-alerts-edit-form___het-opslaan-van-de-melding-is-mislukt',
					{},
					[App.HET_ARCHIEF]
				),
				type: ToastType.ERROR,
			});
		}
		if (!isFormValid()) {
			showToast({
				title: tText('modules/maintenance-alerts/views/maintenance-alerts-edit-form___error', {}, [
					App.HET_ARCHIEF,
				]),
				description: tText(
					'modules/maintenance-alerts/views/maintenance-alerts-edit-form___bepaalde-velden-in-het-formulier-zijn-niet-correct-ingevuld',
					{},
					[App.HET_ARCHIEF]
				),
				type: ToastType.ERROR,
			});
			return;
		}
		if (maintenanceAlert?.id) {
			try {
				await MaintenanceAlertsService.updateAlert(
					maintenanceAlert.id,
					currentMaintenanceAlert as MaintenanceAlertDto
				);

				showToast({
					title: tText('react-admin/modules/alerts/views/alerts-overview___succes', {}, [
						App.HET_ARCHIEF,
					]),
					description: tText(
						'react-admin/modules/alerts/views/alerts-overview___het-aanpassen-van-de-melding-is-gelukt',
						{},
						[App.HET_ARCHIEF]
					),
					type: ToastType.SUCCESS,
				});
			} catch (err) {
				console.error(new CustomError('Failed to update alert', err));

				showToast({
					title: tText('react-admin/modules/alerts/views/alerts-overview___error', {}, [
						App.HET_ARCHIEF,
					]),
					description: tText(
						'react-admin/modules/alerts/views/alerts-overview___het-aanpassen-van-de-melding-is-mislukt',
						{},
						[App.HET_ARCHIEF]
					),
					type: ToastType.ERROR,
				});
			}
		} else {
			try {
				await MaintenanceAlertsService.insertAlert(currentMaintenanceAlert as MaintenanceAlert);

				showToast({
					title: tText('react-admin/modules/alerts/views/alerts-overview___succes', {}, [
						App.HET_ARCHIEF,
					]),
					description: tText(
						'react-admin/modules/alerts/views/alerts-overview___het-aanmaken-van-de-melding-is-gelukt',
						{},
						[App.HET_ARCHIEF]
					),
					type: ToastType.SUCCESS,
				});
			} catch (err) {
				console.error(new CustomError('Failed to create alert', err));

				showToast({
					title: tText('react-admin/modules/alerts/views/alerts-overview___error', {}, [
						App.HET_ARCHIEF,
					]),
					description: tText(
						'react-admin/modules/alerts/views/alerts-overview___het-aanmaken-van-de-melding-is-mislukt',
						{},
						[App.HET_ARCHIEF]
					),
					type: ToastType.ERROR,
				});
			}
		}

		handleClose();
	};

	const renderedTitle = useMemo(() => {
		return (
			<FormControl
				id="new-alert-title"
				label={tHtml('react-admin/modules/alerts/views/alerts-overview___titel-melding', {}, [
					App.HET_ARCHIEF,
				])}
				errors={[errors.title]}
			>
				<TextInput
					value={currentMaintenanceAlert?.title}
					id="new-alert-title"
					onChange={(e) => {
						const title = e.currentTarget.value;
						setCurrentMaintenanceAlert({
							...currentMaintenanceAlert,
							title,
						});
					}}
					onBlur={isFormValid}
					ariaLabel={tText(
						'modules/maintenance-alerts/views/maintenance-alerts-edit-form___titel-melding-input-aria-label'
					)}
				/>
			</FormControl>
		);
	}, [isFormValid, currentMaintenanceAlert, errors.title]);

	const renderedMessage = useMemo(() => {
		return (
			<FormControl
				id="new-alert-message"
				label={tHtml('react-admin/modules/alerts/views/alerts-overview___beschrijving', {}, [
					App.HET_ARCHIEF,
				])}
				errors={[errors.message]}
				key={currentMaintenanceAlert?.id}
			>
				<RichTextEditorWithInternalState
					value={currentMaintenanceAlert?.message}
					controls={RICH_TEXT_EDITOR_OPTIONS}
					key={maintenanceAlert?.id}
					onChange={(newMessage) => {
						setCurrentMaintenanceAlert({
							...currentMaintenanceAlert,
							message: newMessage,
						});
					}}
					onBlur={isFormValid}
				></RichTextEditorWithInternalState>
			</FormControl>
		);
	}, [currentMaintenanceAlert, errors.message, maintenanceAlert?.id, isFormValid]);

	const renderedIcon = useMemo(() => {
		return (
			<FormControl
				id="new-alert-icon"
				label={tHtml(
					'react-admin/modules/alerts/views/alerts-overview___verduidelijkend-icoon',
					{},
					[App.HET_ARCHIEF]
				)}
				errors={[errors.type]}
			>
				<IconPicker
					options={GET_ALERTS_ICON_OPTIONS()}
					value={
						GET_ALERTS_ICON_OPTIONS().find(
							(option) => option.key === currentMaintenanceAlert?.type
						) ?? null
					}
					onChange={(option) => {
						const type: string | null = (option as { key: string; value: string })?.key ?? null;

						setCurrentMaintenanceAlert({ ...currentMaintenanceAlert, type });
					}}
				/>
			</FormControl>
		);
	}, [currentMaintenanceAlert, errors.type]);

	const renderedUserGroup = useMemo(() => {
		return (
			<FormControl
				id="new-alert-user-group"
				label={tHtml(
					'react-admin/modules/alerts/views/alerts-overview___zichtbaar-voor-gebruikersgroep',
					{},
					[App.HET_ARCHIEF]
				)}
				errors={[errors.userGroups]}
			>
				<MultiSelect
					options={(userGroupOptions as MultiSelectOption[]).map((option) => ({
						...option,
						checked: currentMaintenanceAlert?.userGroups?.includes(option.id) || false,
					}))}
					onChange={(checked: boolean, id: string) => {
						setCurrentMaintenanceAlert({
							...currentMaintenanceAlert,
							userGroups: !checked
								? [...(currentMaintenanceAlert?.userGroups || []), id]
								: without(currentMaintenanceAlert?.userGroups || [], id),
						});
					}}
					label={tText(
						'react-admin/modules/alerts/views/alerts-overview___zichtbaar-voor-gebruikersgroep',
						{},
						[App.HET_ARCHIEF]
					)}
					iconOpen={<Icon name="angleUp" />}
					iconClosed={<Icon name="angleDown" />}
					iconCheck={<Icon name="check" />}
					id="maintenance-alerts-edit-form__user-groups-select"
				/>
			</FormControl>
		);
	}, [currentMaintenanceAlert, errors.userGroups, userGroupOptions]);

	const renderedFrom = useMemo(() => {
		return (
			<FormControl
				id="new-alert-from-date"
				label={tHtml('react-admin/modules/alerts/views/alerts-overview___zichtbaar-van', {}, [
					App.HET_ARCHIEF,
				])}
				errors={[errors.fromDate]}
				className="c-input--date-time"
			>
				<DatePicker
					{...getDatePickerDefaultProps('maintenance-alerts-edit-form__from-date-picker')}
					id="new-alert-from-date"
					name="fromDate"
					onBlur={isFormValid}
					onChange={
						((newFromDates: Date[] | null) => {
							const newFromDate = newFromDates?.[0] || null;
							if (newFromDate) {
								const oldFromDate: Date | null = currentMaintenanceAlert?.fromDate
									? parseAsIsoWithoutTimezone(currentMaintenanceAlert.fromDate)
									: null;
								setCurrentMaintenanceAlert({
									...currentMaintenanceAlert,
									fromDate: new Date(
										newFromDate.getFullYear(),
										newFromDate.getMonth(),
										newFromDate.getDate(),
										oldFromDate?.getHours() || 0,
										oldFromDate?.getMinutes() || 0
									).toISOString(),
								});
							}
							// biome-ignore lint/suspicious/noExplicitAny: TODO fix
						}) as any
					}
					selected={
						currentMaintenanceAlert?.fromDate
							? parseAsIsoWithoutTimezone(currentMaintenanceAlert.fromDate)
							: new Date()
					}
				/>

				<Timepicker
					{...getTimePickerDefaults(
						'maintenance-alerts-edit-form__from-time',
						tText(
							'modules/maintenance-alerts/views/maintenance-alerts-edit-form___zichtbaar-vanaf-tijd-input-aria-label'
						)
					)}
					name="fromDate"
					onBlur={isFormValid}
					onChange={
						((newFromTime: Date | null) => {
							if (newFromTime) {
								const oldFromDate: Date = currentMaintenanceAlert?.fromDate
									? parseAsIsoWithoutTimezone(currentMaintenanceAlert.fromDate)
									: new Date();
								setCurrentMaintenanceAlert({
									...currentMaintenanceAlert,
									fromDate: new Date(
										oldFromDate?.getFullYear(),
										oldFromDate?.getMonth(),
										oldFromDate?.getDate(),
										newFromTime.getHours(),
										newFromTime.getMinutes()
									).toISOString(),
								});
							}
							// biome-ignore lint/suspicious/noExplicitAny: TODO fix
						}) as any
					}
					value={
						currentMaintenanceAlert?.fromDate
							? format(parseAsIsoWithoutTimezone(currentMaintenanceAlert.fromDate), 'HH:mm', {
									locale: nlBE,
								})
							: undefined
					}
				/>
			</FormControl>
		);
	}, [isFormValid, currentMaintenanceAlert, errors.fromDate]);

	const renderedUntil = useMemo(() => {
		return (
			<FormControl
				id="new-alert-until-date"
				label={tHtml('react-admin/modules/alerts/views/alerts-overview___zichtbaar-tot', {}, [
					App.HET_ARCHIEF,
				])}
				errors={[errors.untilDate]}
				className="c-input--date-time"
			>
				<DatePicker
					{...getDatePickerDefaultProps('maintenance-alerts-edit-form__until-date-picker')}
					id="new-alert-until-date"
					name="untilDate"
					onBlur={isFormValid}
					onChange={
						((newUntilDates: Date[] | null) => {
							const newUntilDate = newUntilDates?.[0] || null;
							if (newUntilDate) {
								const oldUntilDate: Date | null = currentMaintenanceAlert?.untilDate
									? parseAsIsoWithoutTimezone(currentMaintenanceAlert.untilDate)
									: null;
								setCurrentMaintenanceAlert({
									...currentMaintenanceAlert,
									untilDate: new Date(
										newUntilDate.getFullYear(),
										newUntilDate.getMonth(),
										newUntilDate.getDate(),
										oldUntilDate?.getHours() || 23,
										oldUntilDate?.getMinutes() || 59
									).toISOString(),
								});
							}
							// biome-ignore lint/suspicious/noExplicitAny: TODO fix
						}) as any
					}
					selected={
						currentMaintenanceAlert?.untilDate
							? parseAsIsoWithoutTimezone(currentMaintenanceAlert.untilDate)
							: new Date()
					}
				/>

				<Timepicker
					{...getTimePickerDefaults(
						'maintenance-alerts-edit-form__until-time',
						tText(
							'modules/maintenance-alerts/views/maintenance-alerts-edit-form___zichtbaar-tot-tijd-input-aria-label'
						)
					)}
					name="untilDate"
					onBlur={isFormValid}
					onChange={
						((newUntilTime: Date | null) => {
							if (newUntilTime) {
								const oldUntilDate: Date = currentMaintenanceAlert?.untilDate
									? parseAsIsoWithoutTimezone(currentMaintenanceAlert.untilDate)
									: new Date();
								setCurrentMaintenanceAlert({
									...currentMaintenanceAlert,
									untilDate: new Date(
										oldUntilDate?.getFullYear(),
										oldUntilDate?.getMonth(),
										oldUntilDate?.getDate(),
										newUntilTime.getHours(),
										newUntilTime.getMinutes()
									).toISOString(),
								});
							}
							// biome-ignore lint/suspicious/noExplicitAny: TODO fix
						}) as any
					}
					value={
						currentMaintenanceAlert?.untilDate
							? format(parseAsIsoWithoutTimezone(currentMaintenanceAlert.untilDate), 'HH:mm', {
									locale: nlBE,
								})
							: undefined
					}
				/>
			</FormControl>
		);
	}, [isFormValid, currentMaintenanceAlert, errors.untilDate]);

	const renderedLanguage = useMemo(() => {
		if (!isMultiLanguageEnabled()) {
			return null;
		}
		return (
			<FormControl
				id="new-alert-language"
				label={tHtml('modules/maintenance-alerts/views/maintenance-alerts-edit-form___taal', {}, [
					App.HET_ARCHIEF,
				])}
				errors={[errors.language]}
				className="c-multilanguage-controls"
			>
				<ReactSelect
					options={languageOptions}
					onChange={(option) => {
						const language: Locale | null = ((option as { label: string; value: string })?.value ??
							Locale.Nl) as Locale;

						setCurrentMaintenanceAlert({
							...currentMaintenanceAlert,
							language,
						});
					}}
					value={
						languageOptions.find((option) => option.value === currentMaintenanceAlert?.language) ||
						languageOptions.find((option) => option.value === Locale.Nl)
					}
				/>
			</FormControl>
		);
	}, [currentMaintenanceAlert, errors.language, languageOptions]);

	const renderPopupBody = () => {
		if (!currentMaintenanceAlert) {
			return;
		}

		return (
			<div key={`c-maintenance-alert__edit-popup__${maintenanceAlert?.id}`}>
				{renderedTitle}
				{renderedMessage}
				{renderedIcon}
				{renderedUserGroup}
				{renderedFrom}
				{renderedUntil}
				{renderedLanguage}
			</div>
		);
	};

	return renderPopup({
		title:
			action === 'create'
				? tText('react-admin/modules/alerts/views/alerts-overview___melding-aanmaken', {}, [
						App.HET_ARCHIEF,
					])
				: tText('react-admin/modules/alerts/views/alerts-overview___melding-aanpassen', {}, [
						App.HET_ARCHIEF,
					]),
		body: renderPopupBody(),
		isOpen: !!maintenanceAlert,
		onSave: onClickSave,
		onClose: handleClose,
	});
};

export default MaintenanceAlertsEditForm as FunctionComponent<MaintenanceAlertsEditFormProps>;
