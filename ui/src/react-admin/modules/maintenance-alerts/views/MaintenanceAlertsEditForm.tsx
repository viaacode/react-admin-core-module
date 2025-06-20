import type { MultiSelectOption, SelectOption } from "@meemoo/react-components";
import {
	FormControl,
	MultiSelect,
	ReactSelect,
	RichTextEditorWithInternalState,
	TextInput,
} from "@meemoo/react-components";
import { format } from "date-fns";
import nlBE from "date-fns/locale/nl-BE/index.js";
import { without } from "lodash-es";
import type { FunctionComponent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ValidationError } from "yup";
import { ToastType } from "~core/config";
import { getDatePickerDefaultProps } from "~modules/content-page/components/DatePicker/DatePicker.consts";
import { MaintenanceAlertsService } from "~modules/maintenance-alerts/maintenance-alerts.service";
import type {
	MaintenanceAlert,
	MaintenanceAlertDto,
	MaintenanceAlertsEditFormProps,
} from "~modules/maintenance-alerts/maintenance-alerts.types";
import { Icon } from "~shared/components/Icon";
import { IconPicker } from "~modules/shared/components/IconPicker/IconPicker";
import { useGetAllLanguages } from "~modules/translations/hooks/use-get-all-languages";
import { Locale } from "~modules/translations/translations.core.types";
import type { LanguageInfo } from "~modules/translations/translations.types";
import { useUserGroupOptions } from "~modules/user-group/hooks/useUserGroupOptions";
import { DateInput } from "~shared/components/DateInput/DateInput";
import { Timepicker } from "~shared/components/Timepicker/Timepicker";
import { timePickerDefaults } from "~shared/components/Timepicker/Timepicker.consts";
import { GET_LANGUAGE_NAMES } from "~shared/consts/language-names";
import { CustomError } from "~shared/helpers/custom-error";
import { parseAsIsoWithoutTimezone } from "~shared/helpers/formatters/date";
import { isMultiLanguageEnabled } from "~shared/helpers/is-multi-language-enabled";
import { showToast } from "~shared/helpers/show-toast";
import { tHtml, tText } from "~shared/helpers/translation-functions";
import {
	ALERTS_FORM_SCHEMA,
	GET_ALERTS_ICON_OPTIONS,
	RICH_TEXT_EDITOR_OPTIONS,
} from "../maintenance-alerts.const";

const MaintenanceAlertsEditForm: FunctionComponent<
	MaintenanceAlertsEditFormProps
> = ({ maintenanceAlert, action, renderPopup, onClose }) => {
	const [userGroupOptions] = useUserGroupOptions(
		"MultiSelectOption",
		true,
		false,
	);

	const { data: allLanguages } = useGetAllLanguages();

	const [currentMaintenanceAlert, setCurrentMaintenanceAlert] =
		useState<Partial<MaintenanceAlert> | null>(maintenanceAlert);
	const [errors, setErrors] = useState<
		Partial<Record<keyof MaintenanceAlert, string>>
	>({});

	const languageOptions = (allLanguages || []).map(
		(languageInfo: LanguageInfo): SelectOption => ({
			value: languageInfo.languageCode,
			label: GET_LANGUAGE_NAMES()[languageInfo.languageCode],
		}),
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
						"modules/maintenance-alerts/views/maintenance-alerts-edit-form___error",
					),
					description: tText(
						"modules/maintenance-alerts/views/maintenance-alerts-edit-form___het-valideren-van-het-formulier-is-mislukt",
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
				title: tText(
					"modules/maintenance-alerts/views/maintenance-alerts-edit-form___error",
				),
				description: tText(
					"modules/maintenance-alerts/views/maintenance-alerts-edit-form___het-opslaan-van-de-melding-is-mislukt",
				),
				type: ToastType.ERROR,
			});
		}
		if (!isFormValid()) {
			showToast({
				title: tText(
					"modules/maintenance-alerts/views/maintenance-alerts-edit-form___error",
				),
				description: tText(
					"modules/maintenance-alerts/views/maintenance-alerts-edit-form___bepaalde-velden-in-het-formulier-zijn-niet-correct-ingevuld",
				),
				type: ToastType.ERROR,
			});
			return;
		}
		if (maintenanceAlert?.id) {
			try {
				await MaintenanceAlertsService.updateAlert(
					maintenanceAlert.id,
					currentMaintenanceAlert as MaintenanceAlertDto,
				);

				showToast({
					title: tText(
						"react-admin/modules/alerts/views/alerts-overview___succes",
					),
					description: tText(
						"react-admin/modules/alerts/views/alerts-overview___het-aanpassen-van-de-melding-is-gelukt",
					),
					type: ToastType.SUCCESS,
				});
			} catch (err) {
				console.error(new CustomError("Failed to update alert", err));

				showToast({
					title: tText(
						"react-admin/modules/alerts/views/alerts-overview___error",
					),
					description: tText(
						"react-admin/modules/alerts/views/alerts-overview___het-aanpassen-van-de-melding-is-mislukt",
					),
					type: ToastType.ERROR,
				});
			}
		} else {
			try {
				await MaintenanceAlertsService.insertAlert(
					currentMaintenanceAlert as MaintenanceAlert,
				);

				showToast({
					title: tText(
						"react-admin/modules/alerts/views/alerts-overview___succes",
					),
					description: tText(
						"react-admin/modules/alerts/views/alerts-overview___het-aanmaken-van-de-melding-is-gelukt",
					),
					type: ToastType.SUCCESS,
				});
			} catch (err) {
				console.error(new CustomError("Failed to create alert", err));

				showToast({
					title: tText(
						"react-admin/modules/alerts/views/alerts-overview___error",
					),
					description: tText(
						"react-admin/modules/alerts/views/alerts-overview___het-aanmaken-van-de-melding-is-mislukt",
					),
					type: ToastType.ERROR,
				});
			}
		}

		handleClose();
	};

	const renderedTitle = useMemo(() => {
		if (!currentMaintenanceAlert) {
			return null;
		}
		return (
			<FormControl
				id="new-alert-title"
				label={tHtml(
					"react-admin/modules/alerts/views/alerts-overview___titel-melding",
				)}
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
				/>
			</FormControl>
		);
	}, [isFormValid, currentMaintenanceAlert, errors.title]);

	const renderedMessage = useMemo(() => {
		if (!currentMaintenanceAlert) {
			return null;
		}
		return (
			<FormControl
				id="new-alert-message"
				label={tHtml(
					"react-admin/modules/alerts/views/alerts-overview___beschrijving",
				)}
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
	}, [
		currentMaintenanceAlert,
		errors.message,
		maintenanceAlert?.id,
		isFormValid,
	]);

	const renderedIcon = useMemo(() => {
		if (!currentMaintenanceAlert) {
			return null;
		}
		return (
			<FormControl
				id="new-alert-icon"
				label={tHtml(
					"react-admin/modules/alerts/views/alerts-overview___verduidelijkend-icoon",
				)}
				errors={[errors.type]}
			>
				<IconPicker
					options={GET_ALERTS_ICON_OPTIONS()}
					value={
						GET_ALERTS_ICON_OPTIONS().find(
							(option) => option.key === currentMaintenanceAlert?.type,
						) ?? null
					}
					onChange={(option) => {
						const type: string | null =
							(option as { key: string; value: string })?.key ?? null;

						setCurrentMaintenanceAlert({ ...currentMaintenanceAlert, type });
					}}
				/>
			</FormControl>
		);
	}, [currentMaintenanceAlert, errors.type]);

	const renderedUserGroup = useMemo(() => {
		if (!currentMaintenanceAlert) {
			return null;
		}
		return (
			<FormControl
				id="new-alert-user-group"
				label={tHtml(
					"react-admin/modules/alerts/views/alerts-overview___zichtbaar-voor-gebruikersgroep",
				)}
				errors={[errors.userGroups]}
			>
				<MultiSelect
					options={(userGroupOptions as MultiSelectOption[]).map((option) => ({
						...option,
						checked:
							currentMaintenanceAlert?.userGroups?.includes(option.id) || false,
					}))}
					onChange={(checked: boolean, id: string) => {
						setCurrentMaintenanceAlert({
							...currentMaintenanceAlert,
							userGroups: !checked
								? [...(currentMaintenanceAlert.userGroups || []), id]
								: without(currentMaintenanceAlert.userGroups, id),
						});
					}}
					label={tText(
						"react-admin/modules/alerts/views/alerts-overview___zichtbaar-voor-gebruikersgroep",
					)}
					iconOpen={<Icon name="angleUp" />}
					iconClosed={<Icon name="angleDown" />}
					iconCheck={<Icon name="check" />}
				/>
			</FormControl>
		);
	}, [currentMaintenanceAlert, errors.userGroups, userGroupOptions]);

	const renderedFrom = useMemo(() => {
		if (!currentMaintenanceAlert) {
			return null;
		}
		return (
			<FormControl
				id="new-alert-from-date"
				label={tHtml(
					"react-admin/modules/alerts/views/alerts-overview___zichtbaar-van",
				)}
				errors={[errors.fromDate]}
				className="c-input--date-time"
			>
				<DateInput
					{...getDatePickerDefaultProps()}
					id="new-alert-from-date"
					name="fromDate"
					onBlur={isFormValid}
					onChange={(newFromDate: Date) => {
						if (newFromDate) {
							const oldFromDate: Date | null = currentMaintenanceAlert.fromDate
								? parseAsIsoWithoutTimezone(currentMaintenanceAlert.fromDate)
								: null;
							setCurrentMaintenanceAlert({
								...currentMaintenanceAlert,
								fromDate: new Date(
									newFromDate.getFullYear(),
									newFromDate.getMonth(),
									newFromDate.getDate(),
									oldFromDate?.getHours() || 0,
									oldFromDate?.getMinutes() || 0,
								).toISOString(),
							});
						}
					}}
					selected={
						currentMaintenanceAlert.fromDate
							? parseAsIsoWithoutTimezone(currentMaintenanceAlert.fromDate)
							: new Date()
					}
				/>

				<Timepicker
					{...timePickerDefaults}
					id="new-alert-from-time"
					name="fromDate"
					onBlur={isFormValid}
					onChange={(newFromTime: Date) => {
						if (newFromTime) {
							const oldFromDate: Date = currentMaintenanceAlert.fromDate
								? parseAsIsoWithoutTimezone(currentMaintenanceAlert.fromDate)
								: new Date();
							setCurrentMaintenanceAlert({
								...currentMaintenanceAlert,
								fromDate: new Date(
									oldFromDate?.getFullYear(),
									oldFromDate?.getMonth(),
									oldFromDate?.getDate(),
									newFromTime.getHours(),
									newFromTime.getMinutes(),
								).toISOString(),
							});
						}
					}}
					value={
						currentMaintenanceAlert.fromDate
							? format(
									parseAsIsoWithoutTimezone(currentMaintenanceAlert.fromDate),
									"HH:mm",
									{
										locale: nlBE,
									},
							  )
							: undefined
					}
				/>
			</FormControl>
		);
	}, [isFormValid, currentMaintenanceAlert, errors.fromDate]);

	const renderedUntil = useMemo(() => {
		if (!currentMaintenanceAlert) {
			return null;
		}
		return (
			<FormControl
				id="new-alert-until-date"
				label={tHtml(
					"react-admin/modules/alerts/views/alerts-overview___zichtbaar-tot",
				)}
				errors={[errors.untilDate]}
				className="c-input--date-time"
			>
				<DateInput
					{...getDatePickerDefaultProps()}
					id="new-alert-until-date"
					name="untilDate"
					onBlur={isFormValid}
					onChange={(newUntilDate: Date) => {
						if (newUntilDate) {
							const oldUntilDate: Date | null =
								currentMaintenanceAlert.untilDate
									? parseAsIsoWithoutTimezone(currentMaintenanceAlert.untilDate)
									: null;
							setCurrentMaintenanceAlert({
								...currentMaintenanceAlert,
								untilDate: new Date(
									newUntilDate.getFullYear(),
									newUntilDate.getMonth(),
									newUntilDate.getDate(),
									oldUntilDate?.getHours() || 23,
									oldUntilDate?.getMinutes() || 59,
								).toISOString(),
							});
						}
					}}
					selected={
						currentMaintenanceAlert.untilDate
							? parseAsIsoWithoutTimezone(currentMaintenanceAlert.untilDate)
							: new Date()
					}
				/>

				<Timepicker
					{...timePickerDefaults}
					id="new-alert-until-time"
					name="untilDate"
					onBlur={isFormValid}
					onChange={(newUntilTime: Date) => {
						if (newUntilTime) {
							const oldUntilDate: Date = currentMaintenanceAlert.untilDate
								? parseAsIsoWithoutTimezone(currentMaintenanceAlert.untilDate)
								: new Date();
							setCurrentMaintenanceAlert({
								...currentMaintenanceAlert,
								untilDate: new Date(
									oldUntilDate?.getFullYear(),
									oldUntilDate?.getMonth(),
									oldUntilDate?.getDate(),
									newUntilTime.getHours(),
									newUntilTime.getMinutes(),
								).toISOString(),
							});
						}
					}}
					value={
						currentMaintenanceAlert.untilDate
							? format(
									parseAsIsoWithoutTimezone(currentMaintenanceAlert.untilDate),
									"HH:mm",
									{
										locale: nlBE,
									},
							  )
							: undefined
					}
				/>
			</FormControl>
		);
	}, [isFormValid, currentMaintenanceAlert, errors.untilDate]);

	const renderedLanguage = useMemo(() => {
		if (!currentMaintenanceAlert) {
			return null;
		}
		if (!isMultiLanguageEnabled()) {
			return null;
		}
		return (
			<FormControl
				id="new-alert-language"
				label={tHtml(
					"modules/maintenance-alerts/views/maintenance-alerts-edit-form___taal",
				)}
				errors={[errors.language]}
				className="c-multilanguage-controls"
			>
				<ReactSelect
					options={languageOptions}
					onChange={(option) => {
						const language: Locale | null = ((
							option as { label: string; value: string }
						)?.value ?? Locale.Nl) as Locale;

						setCurrentMaintenanceAlert({
							...currentMaintenanceAlert,
							language,
						});
					}}
					value={
						languageOptions.find(
							(option) => option.value === currentMaintenanceAlert.language,
						) || languageOptions.find((option) => option.value === Locale.Nl)
					}
				/>
			</FormControl>
		);
	}, [currentMaintenanceAlert, errors.language, languageOptions]);

	const renderPopupBody = () => {
		if (!maintenanceAlert) {
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
			action === "create"
				? tText(
						"react-admin/modules/alerts/views/alerts-overview___melding-aanmaken",
				  )
				: tText(
						"react-admin/modules/alerts/views/alerts-overview___melding-aanpassen",
				  ),
		body: renderPopupBody(),
		isOpen: !!maintenanceAlert,
		onSave: onClickSave,
		onClose: handleClose,
	});
};

export default MaintenanceAlertsEditForm as FunctionComponent<MaintenanceAlertsEditFormProps>;
