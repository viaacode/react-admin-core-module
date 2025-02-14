import type { SelectOption } from '@meemoo/react-components';
import { ReactSelect } from '@meemoo/react-components';
import { Alert, Form, FormGroup, TextArea, TextInput } from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import { get, kebabCase } from 'lodash-es';
import type { FunctionComponent, ReactNode } from 'react';
import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { useGetAllLanguages } from '~modules/translations/hooks/use-get-all-languages';
import { Locale } from '~modules/translations/translations.core.types';
import { ContentPicker } from '~shared/components/ContentPicker/ContentPicker';

import { IconPicker } from '~shared/components/IconPicker/IconPicker';
import { UserGroupSelect } from '~shared/components/UserGroupSelect/UserGroupSelect';
import { GET_ADMIN_ICON_OPTIONS } from '~shared/consts/icons.consts';
import { GET_LANGUAGE_NAMES } from '~shared/consts/language-names';
import { isMultiLanguageEnabled } from '~shared/helpers/is-multi-language-enabled';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import type { ReactSelectOption, ValueOf } from '~shared/types';
import type { PickerItem } from '~shared/types/content-picker';
import type { NavigationEditFormErrorState, NavigationItem } from '../../navigation.types';

import './NavigationEditForm.scss';
import { SpecialPermissionGroups } from '~shared/types/authentication.types';
import { useGetUserGroups } from '~modules/user-group/hooks/get-user-groups';

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

export const NavigationEditForm: FunctionComponent<NavigationEditFormProps> = ({
	formErrors,
	formState,
	navigationParentId,
	navigationParentOptions,
	onChange,
	permissionWarning,
	enableIcons,
}) => {
	const { data: allLanguages } = useGetAllLanguages();
	const { data: allUserGroupOptions } = useGetUserGroups({
		withPermissions: false,
	});

	const languageOptions = (allLanguages || []).map((languageInfo): SelectOption => {
		return {
			label: GET_LANGUAGE_NAMES()[languageInfo.languageCode],
			value: languageInfo.languageCode,
		};
	});

	const handleMenuCreate = (label: string) => {
		return {
			label,
			value: kebabCase(label),
		};
	};

	const lastUserGroupOption = allUserGroupOptions?.at(-1);
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
						'CONTENT_PAGE',
						'INTERNAL_LINK',
						'EXTERNAL_LINK',
						'CUSTOM_NAVIGATION_ELEMENTS',
					]}
					value={
						formState.contentType && formState.contentPath
							? {
									type: formState.contentType as Avo.Core.ContentPickerType,
									label: formState.contentPath.toString(),
									value: formState.contentPath.toString(),
									target: formState.linkTarget || undefined,
							  }
							: undefined
					}
					onChange={(item: any) => {
						onChange('content', item);
					}}
				/>
			</FormGroup>
			{isMultiLanguageEnabled() && (
				<FormGroup
					label={tText(
						'modules/navigation/components/navigation-edit-form/navigation-edit-form___taal'
					)}
					error={formErrors.language}
					className="c-multilanguage-controls"
				>
					<ReactSelect
						options={languageOptions}
						value={
							languageOptions.find(
								(option) => option.value === (formState.language || Locale.Nl)
							) || languageOptions[0]
						}
						onChange={(evt) => onChange('language', (evt as SelectOption).value)}
					/>
				</FormGroup>
			)}
			{allUserGroupOptions?.length && (
				<UserGroupSelect
					label={tText(
						'admin/menu/components/menu-edit-form/menu-edit-form___zichtbaar-voor'
					)}
					error={formErrors.userGroupIds}
					placeholder={tText(
						'admin/menu/components/menu-edit-form/menu-edit-form___niemand'
					)}
					values={formState.userGroupIds || []}
					required={false}
					onChange={(userGroupIds: string[]) => onChange('userGroupIds', userGroupIds)}
					defaultCheckedOptions={[
						SpecialPermissionGroups.loggedOutUsers,
						SpecialPermissionGroups.loggedInUsers,
					]}
				/>
			)}
			{formState.contentType === 'INTERNAL_LINK' && (
				<Alert
					message={tHtml(
						'modules/navigation/components/navigation-edit-form/navigation-edit-form___opgelet-voor-statische-links-moet-je-zelf-zorgen-dat-de-geselecteerde-gebruikersgroepen-overeen-komen-met-wie-toegang-heeft-tot-die-statische-pagina'
					)}
					type="warn"
				/>
			)}
			{permissionWarning && <Alert message={permissionWarning} type="danger" />}
		</Form>
	);
};
