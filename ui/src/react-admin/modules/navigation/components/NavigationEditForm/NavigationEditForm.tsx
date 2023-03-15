import { Alert, Form, FormGroup, TextArea, TextInput } from '@viaa/avo2-components';
import { get, kebabCase } from 'lodash-es';
import React, { FunctionComponent, ReactNode } from 'react';
import CreatableSelect from 'react-select/creatable';
import { ContentPicker } from '~shared/components/ContentPicker/ContentPicker';
import { ContentPickerType } from '~shared/components/ContentPicker/ContentPicker.types';

import { IconPicker } from '~shared/components/IconPicker/IconPicker';
import { UserGroupSelect } from '~shared/components/UserGroupSelect/UserGroupSelect';
import { GET_ADMIN_ICON_OPTIONS } from '~shared/consts/icons.consts';
import { useTranslation } from '~shared/hooks/useTranslation';
import { ReactSelectOption, ValueOf } from '~shared/types';
import { PickerItem } from '~shared/types/content-picker';
import { NavigationEditFormErrorState, NavigationItem } from '../../navigation.types';

import './NavigationEditForm.scss';

interface NavigationEditFormProps {
	formErrors: NavigationEditFormErrorState;
	formState: NavigationItem;
	navigationParentId: string | undefined;
	navigationParentOptions: ReactSelectOption<string>[];
	onChange: (
		key: keyof NavigationItem | 'content',
		value: ValueOf<NavigationItem> | PickerItem | null
	) => void;
	permissionWarning: ReactNode | null;
	enableIcons: boolean;
}

const NavigationEditForm: FunctionComponent<NavigationEditFormProps> = ({
	formErrors,
	formState,
	navigationParentId,
	navigationParentOptions,
	onChange,
	permissionWarning,
	enableIcons,
}) => {
	const { tText } = useTranslation();

	const handleMenuCreate = (label: string) => {
		return {
			label,
			value: kebabCase(label),
		};
	};

	return (
		<Form className="m-menu-edit-form">
			<FormGroup
				error={formErrors.placement}
				label={tText(
					'admin/menu/components/menu-edit-form/menu-edit-form___navigatie-naam'
				)}
				required
			>
				{/* TODO: Add CreatableSelect to components lib */}
				<CreatableSelect
					value={navigationParentOptions.find((opt) => opt.value === navigationParentId)}
					formatCreateLabel={(inputValue) => `Aanmaken: ${inputValue}`}
					getNewOptionData={handleMenuCreate}
					onChange={(option: any) => onChange('placement', get(option, 'value', ''))}
					options={navigationParentOptions}
					placeholder={tText(
						'admin/menu/components/menu-edit-form/menu-edit-form___selecteer-of-maak-een-navigatie-aan'
					)}
					isDisabled={!!navigationParentId}
				/>
			</FormGroup>
			{!navigationParentId && (
				<FormGroup
					error={formErrors.description}
					label={tText(
						'admin/menu/components/menu-edit-form/menu-edit-form___navigatie-omschrijving'
					)}
				>
					<TextArea
						onChange={(value: string) => onChange('description', value)}
						value={formState.description || undefined}
					/>
				</FormGroup>
			)}
			{enableIcons && (
				<FormGroup
					label={tText('admin/menu/components/menu-edit-form/menu-edit-form___icoon')}
				>
					<IconPicker
						options={GET_ADMIN_ICON_OPTIONS()}
						onChange={(option: any) => onChange('iconName', get(option, 'value', ''))}
						value={GET_ADMIN_ICON_OPTIONS().find(
							(option: ReactSelectOption<string>) =>
								option.value === formState.iconName
						)}
					/>
				</FormGroup>
			)}
			<FormGroup
				error={formErrors.label}
				label={tText('admin/menu/components/menu-edit-form/menu-edit-form___label')}
			>
				<TextInput
					onChange={(value: string) => onChange('label', value)}
					value={formState.label || undefined}
				/>
			</FormGroup>
			<FormGroup
				error={formErrors.tooltip}
				label={tText('admin/menu/components/menu-edit-form/menu-edit-form___tooltip')}
			>
				<TextInput
					onChange={(value: string) => onChange('tooltip', value)}
					value={formState.tooltip || undefined}
				/>
			</FormGroup>
			<FormGroup
				error={formErrors.contentPath}
				label={tText('admin/menu/components/menu-edit-form/menu-edit-form___link')}
				required
			>
				<ContentPicker
					allowedTypes={[
						ContentPickerType.CONTENT_PAGE,
						ContentPickerType.INTERNAL_LINK,
						ContentPickerType.EXTERNAL_LINK,
						ContentPickerType.CUSTOM_NAVIGATION_ELEMENTS,
					]}
					value={
						formState.contentType && formState.contentPath
							? {
									type: formState.contentType as ContentPickerType,
									label: formState.contentPath.toString(),
									value: formState.contentPath.toString(),
							  }
							: undefined
					}
					onChange={(item: any) => {
						onChange('content', item);
					}}
				/>
			</FormGroup>
			<UserGroupSelect
				label={tText(
					'admin/menu/components/menu-edit-form/menu-edit-form___zichtbaar-voor'
				)}
				error={formErrors.userGroupIds}
				placeholder={tText('admin/menu/components/menu-edit-form/menu-edit-form___niemand')}
				values={formState.userGroupIds || []}
				required={false}
				onChange={(userGroupIds: string[]) => onChange('userGroupIds', userGroupIds)}
			/>
			{permissionWarning && <Alert message={permissionWarning} type="danger" />}
		</Form>
	);
};

export default NavigationEditForm;
