import {
	Button,
	Column,
	Dropdown,
	DropdownButton,
	DropdownContent,
	Form,
	FormGroup,
	Grid,
	RadioButtonGroup,
	Spacer,
	TextInput,
} from '@viaa/avo2-components';
import { format, isValid, parse, set } from 'date-fns';
import type { FC, MouseEvent, ReactText } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { getDatePickerDefaultProps } from '~modules/content-page/components/DatePicker/DatePicker.consts';
import { DateInput } from '~shared/components/DateInput/DateInput';
import { showToast } from '~shared/helpers/show-toast';

import { reorderDate } from '../../helpers/formatters/date';
import { renderDropdownButton } from '../CheckboxDropdownModal/CheckboxDropdownModal';

import { ToastType } from '~core/config/config.types';
import { tText } from '~shared/helpers/translation-functions';

export interface DateRangeDropdownProps {
	label: string;
	id: string;
	range?: { gte: string; lte: string };
	showPastFutureOptions?: boolean;
	defaultControls?: DateRangeControls;
	onChange: (dateRange: { gte: string; lte: string }, id: string) => void;
}

export interface DateRange {
	gte: string;
	lte: string;
}

export type DateRangeControls = 'year' | 'date' | 'past' | 'future';

const DEFAULT_DATE_RANGE = { gte: '', lte: '' };
const DEFAULT_PAST_DATE_RANGE = {
	gte: '',
	lte: new Date().toISOString(),
};
const DEFAULT_FUTURE_DATE_RANGE = {
	gte: new Date().toISOString(),
	lte: '',
};

const DateRangeDropdown: FC<DateRangeDropdownProps> = ({
	label,
	id,
	range = DEFAULT_DATE_RANGE,
	showPastFutureOptions = false,
	defaultControls = 'year',
	onChange,
}) => {
	// Internal range state (copied to external range state when the user clicks on the apply button
	const [rangeState, setRangeState] = useState<DateRange>(range);
	const [dateControls, setDateControls] = useState<DateRangeControls>(defaultControls);
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	const [yearInputGte, setYearInputGte] = useState<string>('');
	const [yearInputLte, setYearInputLte] = useState<string>('');

	const setDateControlsAndSimplifyDates = (newDateRangeControls: DateRangeControls) => {
		if (newDateRangeControls === 'year') {
			setDateControls(newDateRangeControls);
			setRangeState({
				gte: (rangeState?.gte || new Date().toISOString()).split('-')[0],
				lte: (rangeState?.lte || new Date().toISOString()).split('-')[0],
			});
		} else if (newDateRangeControls === 'date') {
			setDateControls('date');
			const gteDate =
				parseDateFromString(rangeState?.gte || new Date().toISOString()) || new Date();
			const lteDate =
				parseDateFromString(rangeState?.lte || new Date().toISOString()) || new Date();
			setRangeState({
				gte: format(set(gteDate, { hours: 0, minutes: 0, seconds: 0 }), 'yyyy-MM-dd HH:mm:ss'),
				lte: format(set(lteDate, { hours: 23, minutes: 59, seconds: 59 }), 'yyyy-MM-dd HH:mm:ss'),
			});
		}
	};

	const applyDefaultRangeState = useCallback(() => {
		setRangeState((oldRangeState) => {
			if (
				dateControls === 'year' &&
				!oldRangeState.gte?.includes(':') &&
				!oldRangeState.lte?.includes(':')
			) {
				// Round selected dates to the larger year
				setYearInputGte(oldRangeState.gte ? oldRangeState.gte.split('-')[0] : '');
				setYearInputLte(oldRangeState.lte ? oldRangeState.lte.split('-')[0] : '');
				return {
					gte: oldRangeState.gte ? `${oldRangeState.gte.split('-')[0]}-01-01` : '',
					lte: oldRangeState.lte ? `${oldRangeState.lte.split('-')[0]}-12-31` : '',
				};
			} else if (dateControls === 'past') {
				return DEFAULT_PAST_DATE_RANGE;
			} else if (dateControls === 'future') {
				return DEFAULT_FUTURE_DATE_RANGE;
			} else if (oldRangeState.gte?.includes(':') && oldRangeState.lte?.includes(':')) {
				// More precise date was selected, so select "date" mode automatically
				setDateControls('date');
			}
			return oldRangeState;
		});
	}, [dateControls]);

	const resetInternalRangeState = async (_tagId?: ReactText, evt?: MouseEvent): Promise<void> => {
		evt?.stopPropagation();
		applyDefaultRangeState();
	};

	useEffect(() => {
		applyDefaultRangeState();
	}, [applyDefaultRangeState]);

	/**
	 * State is only passed from the component to the parent when the user clicks the "Apply" button
	 */
	const applyFilter = async (): Promise<void> => {
		onChange(rangeState, id);
		await closeDropdown();
	};

	const removeFilter = (_tagId: ReactText, evt: MouseEvent) => {
		evt.stopPropagation();
		setRangeState(DEFAULT_DATE_RANGE);
		setYearInputGte('');
		setYearInputLte('');
		onChange(DEFAULT_DATE_RANGE, id);
	};

	const handleDateChange = async (date: Date | null, rangeId: 'gte' | 'lte') => {
		if (date) {
			let newDate: Date;
			if (rangeId === 'gte') {
				newDate = set(date, { hours: 0, minutes: 0, seconds: 0 });
			} else {
				newDate = set(date, { hours: 23, minutes: 59, seconds: 59 });
			}
			setRangeState({
				...rangeState,
				[rangeId]: format(newDate, 'yyyy-MM-dd HH:mm:ss'),
			});
		} else {
			setRangeState({
				...rangeState,
				[rangeId]: '',
			});
		}
	};

	const handleYearInputChange = async (value: string, rangeId: 'gte' | 'lte') => {
		try {
			rangeId === 'gte' ? setYearInputGte(value) : setYearInputLte(value);
			if (value.match(/^[0-9]{4}$/g)) {
				await handleDateChange(
					new Date(parseInt(value, 10), rangeId === 'gte' ? 0 : 11, rangeId === 'gte' ? 1 : 31),
					rangeId
				);
			} else {
				await handleDateChange(null, rangeId);
			}
		} catch (_err) {
			showToast({
				title: tText(
					'modules/admin/shared/components/date-range-dropdown/date-range-dropdown___ongeldige-input'
				),
				description: `${tText(
					'shared/components/date-range-dropdown/date-range-dropdown___ongeldig-jaar'
				)} ${value}`,
				type: ToastType.ERROR,
			});
		}
	};

	const openDropdown = async () => {
		await resetInternalRangeState();
		setIsDropdownOpen(true);
	};

	const closeDropdown = () => setIsDropdownOpen(false);

	const getTag = () => {
		const { gte, lte } = range;
		const isGteStartOfYear = gte.includes('-01-01');
		const isLteEndOfYear = lte.includes('-12-31');
		const gteFormattedDate = reorderDate(gte);
		const lteFormattedDate = reorderDate(lte);
		const gteYear = gte.split('-')[0];
		const lteYear = lte.split('-')[0];
		let tagLabel: string | null = null;

		if (gte && lte) {
			if (isGteStartOfYear && isLteEndOfYear) {
				// only show years
				tagLabel = `${gteYear} - ${lteYear}`;
			} else {
				// show full dates
				tagLabel = `${reorderDate(gte)} - ${reorderDate(lte)}`;
			}
		} else if (gte) {
			tagLabel = `na ${isGteStartOfYear ? gteYear : gteFormattedDate}`;
		} else if (lte) {
			tagLabel = `voor ${isLteEndOfYear ? lteYear : lteFormattedDate}`;
		}

		if (tagLabel) {
			return [
				{
					label: tagLabel,
					id: 'date',
				},
			];
		}

		return []; // Do not render a filter if date object is empty: {gte: "", lte: ""}
	};

	const parseDateFromString = (dateString: string | null): Date | null => {
		if (!dateString) {
			return null;
		}
		let date: Date | null = parse(dateString, 'yyyy', new Date());
		if (!isValid(date)) {
			date = parse(dateString, 'yyyy-MM-dd', new Date());
		}
		if (!isValid(date)) {
			date = parse(dateString, 'yyyy-MM-dd HH:mm:ss', new Date());
		}
		if (!isValid(date)) {
			date = null;
		}
		return date;
	};

	let dateRange = rangeState;
	if (dateControls === 'past') {
		dateRange = DEFAULT_PAST_DATE_RANGE;
	}
	if (dateControls === 'future') {
		dateRange = DEFAULT_FUTURE_DATE_RANGE;
	}
	const from = dateRange.gte;
	const till = dateRange.lte;
	let fromYear: string;
	let tillYear: string;

	// Get year from state or yearInputString
	if (dateControls === 'year') {
		fromYear = (yearInputGte || from || '').split('-')[0];
		tillYear = (yearInputLte || till || '').split('-')[0];
	} else {
		fromYear = (from || yearInputGte || '').split('-')[0];
		tillYear = (till || yearInputLte || '').split('-')[0];
	}

	const fromDate: Date | null = parseDateFromString(from);
	const tillDate: Date | null = parseDateFromString(till);

	return (
		<Dropdown
			label={label}
			menuWidth="fit-content"
			isOpen={isDropdownOpen}
			onOpen={openDropdown}
			onClose={closeDropdown}
		>
			<DropdownButton>
				{renderDropdownButton(label, isDropdownOpen, getTag(), removeFilter)}
			</DropdownButton>
			<DropdownContent>
				<Spacer className="c-date-range-dropdown__content">
					<Form>
						<FormGroup
							label={tText(
								'shared/components/date-range-dropdown/date-range-dropdown___hoe-specifiek'
							)}
						>
							<RadioButtonGroup
								inline={!showPastFutureOptions}
								options={[
									{
										label: tText(
											'shared/components/date-range-dropdown/date-range-dropdown___op-jaartal'
										),
										value: 'year',
									},
									{
										label: tText(
											'shared/components/date-range-dropdown/date-range-dropdown___specifieke-datums'
										),
										value: 'date',
									},
									...(showPastFutureOptions
										? [
												{
													label: tText(
														'shared/components/date-range-dropdown/date-range-dropdown___in-het-verleden'
													),
													value: 'past',
												},
												{
													label: tText(
														'shared/components/date-range-dropdown/date-range-dropdown___in-de-toekomst'
													),
													value: 'future',
												},
											]
										: []),
								]}
								value={dateControls}
								onChange={(value) => setDateControlsAndSimplifyDates(value as DateRangeControls)}
							/>
							{dateControls === 'year' && (
								<Grid>
									<Column size="6">
										<FormGroup
											label={tText(
												'shared/components/date-range-dropdown/date-range-dropdown___van'
											)}
										>
											<TextInput
												id={`${id}-gte`}
												placeholder={tText(
													'shared/components/date-range-dropdown/date-range-dropdown___jjjj'
												)}
												value={fromYear}
												onChange={(value: string) => handleYearInputChange(value, 'gte')}
											/>
										</FormGroup>
									</Column>
									<Column size="6">
										<FormGroup
											label={tText(
												'shared/components/date-range-dropdown/date-range-dropdown___tot'
											)}
										>
											<TextInput
												id={`${id}-lte`}
												placeholder={tText(
													'shared/components/date-range-dropdown/date-range-dropdown___jjjj'
												)}
												value={tillYear}
												onChange={(value: string) => handleYearInputChange(value, 'lte')}
											/>
										</FormGroup>
									</Column>
								</Grid>
							)}
							{(dateControls === 'date' ||
								dateControls === 'past' ||
								dateControls === 'future') && (
								<Grid>
									<Column size="6">
										<FormGroup
											label={tText(
												'shared/components/date-range-dropdown/date-range-dropdown___van'
											)}
										>
											<DateInput
												{...getDatePickerDefaultProps()}
												selected={fromDate}
												onChange={(value) => handleDateChange(value, 'gte')}
												disabled={dateControls !== 'date'}
											/>
										</FormGroup>
									</Column>
									<Column size="6">
										<FormGroup
											label={tText(
												'shared/components/date-range-dropdown/date-range-dropdown___tot'
											)}
										>
											<DateInput
												{...getDatePickerDefaultProps()}
												selected={tillDate}
												onChange={(value) => handleDateChange(value, 'lte')}
												disabled={dateControls !== 'date'}
											/>
										</FormGroup>
									</Column>
								</Grid>
							)}
						</FormGroup>
						<FormGroup>
							<Button
								label={tText(
									'shared/components/date-range-dropdown/date-range-dropdown___toepassen'
								)}
								type="primary"
								className="c-apply-filter-button"
								block
								onClick={applyFilter}
							/>
						</FormGroup>
					</Form>
				</Spacer>
			</DropdownContent>
		</Dropdown>
	);
};

export default DateRangeDropdown;
