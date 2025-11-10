import type { IconName } from '@viaa/avo2-components';
import {
	Button,
	Dropdown,
	DropdownButton,
	DropdownContent,
	Form,
	FormGroup,
	Icon,
	Spacer,
	TagList,
} from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';
import clsx from 'clsx';
import { uniqBy } from 'es-toolkit';
import type { FunctionComponent, ReactText } from 'react';
import React, { useEffect, useState } from 'react';
import { ToastType } from '~core/config/config.types.js';
import { UserService } from '~modules/user/user.service.js';
import { showToast } from '~shared/helpers/show-toast.js';
import { tText } from '~shared/helpers/translation-functions.js';
import type { PickerItem } from '../../types/content-picker.js';
import { ContentPicker } from '../ContentPicker/ContentPicker.js';

import './MultiUserSelectDropdown.scss';

export interface Tag {
	label: string;
	id: string;
}

export interface MultiUserSelectDropdownProps {
	label: string;
	id: string;
	values: string[];
	disabled?: boolean;
	placeholder?: string;
	onChange: (profileIds: string[], id: string) => void;
	showSelectedValuesOnCollapsed?: boolean;
}

export const MultiUserSelectDropdown: FunctionComponent<MultiUserSelectDropdownProps> = ({
	label,
	id,
	values,
	disabled,
	placeholder,
	onChange,
	showSelectedValuesOnCollapsed = true,
}) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [selectedProfiles, setSelectedProfiles] = useState<PickerItem[]>([]);
	const [selectedProfile, setSelectedProfile] = useState<PickerItem | undefined>(undefined);

	useEffect(() => {
		if (selectedProfile) {
			setSelectedProfile(undefined);
		}
	}, [selectedProfile]);

	useEffect(() => {
		if (values.length) {
			UserService.getNamesByProfileIds(values)
				.then((users: Partial<Avo.User.CommonUser>[]) => {
					setSelectedProfiles(
						users.map(
							(user): PickerItem => ({
								label: `${user?.fullName} (${user?.email})`,
								value: user?.profileId as string,
								type: Avo.Core.ContentPickerType.PROFILE,
							})
						)
					);
				})
				.catch((err: Error) => {
					console.error(
						new Error(
							JSON.stringify({
								message: 'Failed to fetch profile name info for profile ids',
								innerException: err,
								additionalInfo: values,
							})
						)
					);
					showToast({
						title: tText(
							'modules/admin/shared/components/multi-user-select-dropdown/multi-user-select-dropdown___error'
						),
						description: tText(
							'shared/components/multi-user-select-dropdown/multi-user-select-dropdown___het-ophalen-van-de-gebruikersaccount-namen-is-mislukt'
						),
						type: ToastType.ERROR,
					});
				});
		}
	}, [values]);

	const closeDropdown = () => {
		setSelectedProfiles([]);
		setIsOpen(false);
	};

	const applyFilter = () => {
		onChange(
			selectedProfiles.map((profile) => profile.value),
			id
		);
		closeDropdown();
	};

	const removeProfile = (tagId: ReactText) => {
		setSelectedProfiles((selectedProfiles) =>
			selectedProfiles.filter((profile) => profile.value !== tagId)
		);
	};

	const deleteAllSelectedProfiles = () => {
		setSelectedProfiles([]);
		onChange([], id);
	};

	const renderCheckboxControl = () => {
		return (
			<Dropdown
				label={label}
				menuClassName="c-user-dropdown__menu"
				isOpen={isOpen}
				onOpen={() => setIsOpen(true)}
				onClose={closeDropdown}
			>
				<DropdownButton>
					<Button autoHeight className="c-checkbox-dropdown-modal__trigger" type="secondary">
						<div className="c-button__content">
							<div className="c-button__label">{label}</div>
							{!!selectedProfiles.length && showSelectedValuesOnCollapsed && (
								<TagList
									tags={[
										{
											id: 'users',
											label: `${selectedProfiles.length} ${
												selectedProfiles.length > 1
													? tText(
															'shared/components/multi-user-select-dropdown/multi-user-select-dropdown___gebruikers'
														)
													: tText(
															'shared/components/multi-user-select-dropdown/multi-user-select-dropdown___gebruiker'
														)
											}`,
										},
									]}
									swatches={false}
									closable
									onTagClosed={deleteAllSelectedProfiles}
								/>
							)}
							<Icon
								className="c-button__icon"
								name={isOpen ? ('caretUp' as IconName) : ('caretDown' as IconName)}
								size="small"
								type="arrows"
							/>
						</div>
					</Button>
				</DropdownButton>
				<DropdownContent>
					<Spacer>
						<Form>
							{!!selectedProfiles.length && showSelectedValuesOnCollapsed && (
								<TagList
									tags={selectedProfiles.map((profile) => ({
										label: profile.label || profile.value,
										id: profile.value,
									}))}
									swatches={false}
									closable
									onTagClosed={removeProfile}
								/>
							)}
							<Spacer margin={['top', 'bottom']}>
								<div key={`profile-content-picker-${selectedProfile?.label}`}>
									<ContentPicker
										value={selectedProfile}
										onChange={(selectedProfile) => {
											if (selectedProfile) {
												setSelectedProfiles((selectedProfiles) =>
													uniqBy(
														[...selectedProfiles, selectedProfile],
														(pickerItem) => pickerItem.value
													)
												);
												setSelectedProfile(selectedProfile);
											}
										}}
										hideTargetSwitch
										allowedTypes={[Avo.Core.ContentPickerType.PROFILE]}
										hideTypeDropdown
										placeholder={
											placeholder ||
											tText(
												'shared/components/multi-user-select-dropdown/multi-user-select-dropdown___selecteer-een-gebruiker'
											)
										}
									/>
								</div>
							</Spacer>

							<FormGroup>
								<Button
									label={tText(
										'shared/components/checkbox-dropdown-modal/checkbox-dropdown-modal___toepassen'
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

	if (disabled) {
		return (
			<div className={clsx({ 'u-opacity-50 u-disable-click': disabled })}>
				{renderCheckboxControl()}
			</div>
		);
	}

	return renderCheckboxControl();
};
