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
import clsx from 'clsx';
import { uniqBy } from 'lodash-es';
import React, { FunctionComponent, ReactText, useEffect, useState } from 'react';
import { CommonUser } from '~modules/user/user.types';

import { PickerItem } from '../../types/content-picker';
import { ContentPicker } from '../ContentPicker/ContentPicker';

import { Config, ToastType } from '~core/config';
import { ContentPickerType } from '~modules/shared/components/ContentPicker/ContentPicker.types';
import { useTranslation } from '~modules/shared/hooks/useTranslation';
import { UserService } from '~modules/user/user.service';

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
	const { t } = useTranslation();

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [selectedProfiles, setSelectedProfiles] = useState<PickerItem[]>([]);
	const [selectedProfile, setSelectedProfile] = useState<PickerItem | undefined>(undefined);

	useEffect(() => {
		if (selectedProfile) {
			setSelectedProfile(undefined);
		}
	}, [selectedProfile, setSelectedProfile]);

	useEffect(() => {
		if (values.length) {
			UserService.getNamesByProfileIds(values)
				.then((users: Partial<CommonUser>[]) => {
					setSelectedProfiles(
						users.map(
							(user): PickerItem => ({
								label: `${user?.fullName} (${user?.email})`,
								value: user?.profileId as string,
								type: ContentPickerType.PROFILE,
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
					Config.getConfig().services.toastService.showToast({
						title: Config.getConfig().services.i18n.t(
							'modules/admin/shared/components/multi-user-select-dropdown/multi-user-select-dropdown___error'
						),
						description: Config.getConfig().services.i18n.t(
							'shared/components/multi-user-select-dropdown/multi-user-select-dropdown___het-ophalen-van-de-gebruikersaccount-namen-is-mislukt'
						),
						type: ToastType.ERROR,
					});
				});
		}
	}, [values, setSelectedProfiles, t]);

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
					<Button
						autoHeight
						className="c-checkbox-dropdown-modal__trigger"
						type="secondary"
					>
						<div className="c-button__content">
							<div className="c-button__label">{label}</div>
							{!!selectedProfiles.length && showSelectedValuesOnCollapsed && (
								<TagList
									tags={[
										{
											id: 'users',
											label: `${selectedProfiles.length} ${
												selectedProfiles.length > 1
													? t(
															'shared/components/multi-user-select-dropdown/multi-user-select-dropdown___gebruikers'
													  )
													: t(
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
								name={isOpen ? 'caret-up' : 'caret-down'}
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
										onSelect={(selectedProfile) => {
											if (selectedProfile) {
												setSelectedProfiles((selectedProfiles) =>
													uniqBy(
														[...selectedProfiles, selectedProfile],
														'value'
													)
												);
												setSelectedProfile(selectedProfile);
											}
										}}
										hideTargetSwitch
										allowedTypes={[ContentPickerType.PROFILE]}
										hideTypeDropdown
										placeholder={
											placeholder ||
											t(
												'shared/components/multi-user-select-dropdown/multi-user-select-dropdown___selecteer-een-gebruiker'
											)
										}
										initialValue={selectedProfile}
									/>
								</div>
							</Spacer>

							<FormGroup>
								<Button
									label={t(
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