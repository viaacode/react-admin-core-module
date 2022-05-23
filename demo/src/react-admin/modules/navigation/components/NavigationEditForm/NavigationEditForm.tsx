import { get, kebabCase } from 'lodash-es';
import React, { FunctionComponent, ReactNode } from 'react';
import CreatableSelect from 'react-select/creatable';

import { Alert, Form, FormGroup, TextArea, TextInput } from '@viaa/avo2-components';

import { IconPicker } from '../../../shared/components/IconPicker/IconPicker';
import { NavigationEditFormErrorState, NavigationItem } from '../../navigation.types';

import './NavigationEditForm.scss';
import { ContentPicker } from '~modules/shared/components/ContentPicker/ContentPicker';
import { PickerItem } from '~modules/shared/types/content-picker';
import { GET_ADMIN_ICON_OPTIONS } from '~modules/shared/consts/icons.consts';
import { UserGroupSelect } from '~modules/shared/components/UserGroupSelect/UserGroupSelect';
import { ReactSelectOption, ValueOf } from '~modules/shared/types';
import { useTranslation } from '~modules/shared/hooks/useTranslation';
import { ContentPickerType } from '~modules/shared/components/ContentPicker/ContentPicker.types';

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
}

const NavigationEditForm: FunctionComponent<NavigationEditFormProps> = ({
	formErrors,
	formState,
	navigationParentId,
	navigationParentOptions,
	onChange,
	permissionWarning,
}) => {
	const { t } = useTranslation();

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
				label={t('admin/menu/components/menu-edit-form/menu-edit-form___navigatie-naam')}
				required
			>
				{/* TODO: Add CreatableSelect to components lib */}
				<CreatableSelect
					value={navigationParentOptions.find((opt) => opt.value === navigationParentId)}
					formatCreateLabel={(inputValue) => `Aanmaken: ${inputValue}`}
					getNewOptionData={handleMenuCreate}
					onChange={(option: any) => onChange('placement', get(option, 'value', ''))}
					options={navigationParentOptions}
					placeholder={t(
						'admin/menu/components/menu-edit-form/menu-edit-form___selecteer-of-maak-een-navigatie-aan'
					)}
					isDisabled={!!navigationParentId}
				/>
			</FormGroup>
			{!navigationParentId && (
				<FormGroup
					error={formErrors.description}
					label={t(
						'admin/menu/components/menu-edit-form/menu-edit-form___navigatie-omschrijving'
					)}
				>
					<TextArea
						onChange={(value: string) => onChange('description', value)}
						value={formState.description || undefined}
					/>
				</FormGroup>
			)}
			<FormGroup label={t('admin/menu/components/menu-edit-form/menu-edit-form___icoon')}>
				<IconPicker
					options={GET_ADMIN_ICON_OPTIONS()}
					onChange={(option: any) => onChange('icon_name', get(option, 'value', ''))}
					value={GET_ADMIN_ICON_OPTIONS().find(
						(option: ReactSelectOption<string>) => option.value === formState.icon_name
					)}
				/>
			</FormGroup>
			<FormGroup
				error={formErrors.label}
				label={t('admin/menu/components/menu-edit-form/menu-edit-form___label')}
			>
				<TextInput
					onChange={(value: string) => onChange('label', value)}
					value={formState.label || undefined}
				/>
			</FormGroup>
			<FormGroup
				error={formErrors.tooltip}
				label={t('admin/menu/components/menu-edit-form/menu-edit-form___tooltip')}
			>
				<TextInput
					onChange={(value: string) => onChange('tooltip', value)}
					value={formState.tooltip || undefined}
				/>
			</FormGroup>
			<FormGroup
				error={formErrors.content_path}
				label={t('admin/menu/components/menu-edit-form/menu-edit-form___link')}
				required
			>
				<ContentPicker
					allowedTypes={[
						ContentPickerType.CONTENT_PAGE,
						ContentPickerType.INTERNAL_LINK,
						ContentPickerType.EXTERNAL_LINK,
					]}
					onSelect={(item: any) => {
						onChange('content', item);
					}}
					initialValue={
						formState.content_type && formState.content_path
							? {
									type: formState.content_type as ContentPickerType,
									label: formState.content_path.toString(),
									value: formState.content_path.toString(),
							  }
							: undefined
					}
				/>
			</FormGroup>
			<UserGroupSelect
				label={t('admin/menu/components/menu-edit-form/menu-edit-form___zichtbaar-voor')}
				error={formErrors.user_group_ids}
				placeholder={t('admin/menu/components/menu-edit-form/menu-edit-form___niemand')}
				values={formState.user_group_ids || []}
				required={false}
				onChange={(userGroupIds: string[]) => onChange('user_group_ids', userGroupIds)}
			/>
			{permissionWarning && <Alert message={permissionWarning} type="danger" />}
		</Form>
	);
};

export default NavigationEditForm;
