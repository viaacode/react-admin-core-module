import type { SelectOption } from '@meemoo/react-components';
import { ReactSelect } from '@meemoo/react-components';
import type { TagInfo } from '@viaa/avo2-components';
import {
	Alert,
	Badge,
	ButtonToolbar,
	Column,
	Form,
	FormGroup,
	Grid,
	Spacer,
	TextArea,
	TextInput,
} from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import { compact, kebabCase, uniq, without } from 'lodash-es';
import type { FunctionComponent, ReactNode } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
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
import type { ReactSelectOption } from '~shared/types';
import type { NavigationEditFormErrorState, NavigationItem } from '../../navigation.types';

import './NavigationEditForm.scss';
import { SpecialPermissionGroups } from '~shared/types/authentication.types';
import { useGetUserGroups } from '~modules/user-group/hooks/get-user-groups';
import { ContentPageService } from '~modules/content-page/services/content-page.service';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { showToast } from '~modules/shared/helpers/show-toast';
import { ToastType } from '~core/config';

interface NavigationEditFormProps {
	formErrors: NavigationEditFormErrorState;
	currentNavigationItem: NavigationItem;
	navigationParentId: string | undefined;
	navigationParentOptions: ReactSelectOption<string>[];
	onChange: (newNavigationItem: NavigationItem | null) => void;
	allUserGroups: TagInfo[];
	enableIcons: boolean;
}

export const NavigationEditForm: FunctionComponent<NavigationEditFormProps> = ({
	formErrors,
	currentNavigationItem,
	navigationParentId,
	navigationParentOptions,
	onChange,
	allUserGroups,
	enableIcons,
}) => {
	const { data: allLanguages } = useGetAllLanguages();
	const { data: allUserGroupOptions } = useGetUserGroups({
		withPermissions: false,
	});
	const [permissionWarning, setPermissionWarning] = useState<ReactNode | null>(null);

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

	const checkMenuItemContentPagePermissionsMismatch = useCallback(
		(contentUserGroupIds: (string | number)[]) => {
			if (!currentNavigationItem) {
				return;
			}
			const navItemUserGroupIds: string[] = currentNavigationItem.userGroupIds || [];
			const allUserGroupIds: string[] = allUserGroups.map((ug) => String(ug.value));

			// Add all user groups to content page user groups if content page is accessible by special user group: logged-in users
			if (contentUserGroupIds.includes(SpecialPermissionGroups.loggedInUsers)) {
				contentUserGroupIds = uniq([
					...contentUserGroupIds,
					...without(allUserGroupIds, SpecialPermissionGroups.loggedOutUsers),
				]);
			}

			const faultyUserGroupIds = without(navItemUserGroupIds, ...contentUserGroupIds);
			if (faultyUserGroupIds.length) {
				const faultyUserGroups = compact(
					faultyUserGroupIds.map((faultyUserGroupId) => {
						const faultyUserGroup = allUserGroups.find(
							(userGroup) => userGroup.value === faultyUserGroupId
						);
						return faultyUserGroup?.label || null;
					})
				);
				setPermissionWarning(
					<div>
						<Spacer margin="bottom-small">
							<>
								{tHtml(
									'admin/menu/views/menu-edit___het-navigatie-item-zal-zichtbaar-zijn-voor-gebruikers-die-geen-toegang-hebben-tot-de-geselecteerde-pagina'
								)}
							</>
						</Spacer>
						<Spacer margin="bottom-small">
							<>
								{tHtml(
									'admin/menu/views/menu-edit___de-geselecteerde-pagina-is-niet-toegankelijk-voor'
								)}
							</>
							<ButtonToolbar>
								{faultyUserGroups.map((group) => (
									<Badge text={group} key={`badge-${group}`} />
								))}
							</ButtonToolbar>
						</Spacer>
					</div>
				);
			} else {
				setPermissionWarning(null);
			}
		},
		[setPermissionWarning, currentNavigationItem, allUserGroups]
	);

	// Check if the navigation item is visible for users that do not have access to the selected content page
	useEffect(() => {
		if (!currentNavigationItem) {
			setPermissionWarning(null);
			return;
		}
		if (
			currentNavigationItem.contentType === 'CONTENT_PAGE' &&
			currentNavigationItem.contentPath
		) {
			// Check if permissions are stricter than the permissions on the content_page
			ContentPageService.getUserGroupsWithAccessToContentPage(
				currentNavigationItem.contentPath
			)
				.then((userGroupIds) => {
					checkMenuItemContentPagePermissionsMismatch(userGroupIds);
				})
				.catch((err) => {
					console.error(
						new CustomError('Failed to get permissions from page', err, {
							query: 'GET_PERMISSIONS_FROM_CONTENT_PAGE_BY_PATH',
							variables: {
								path: currentNavigationItem.contentPath,
							},
						})
					);

					showToast({
						type: ToastType.ERROR,
						title: tText('modules/navigation/views/navigation-edit___error'),
						description: tText(
							'admin/menu/views/menu-edit___het-controleren-of-de-permissies-van-de-pagina-overeenkomen-met-de-zichtbaarheid-van-dit-navigatie-item-is-mislukt'
						),
					});
				});
		} else {
			setPermissionWarning(null);
		}
	}, [currentNavigationItem, checkMenuItemContentPagePermissionsMismatch]);

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
					onChange={(option: any) =>
						onChange({
							...currentNavigationItem,
							placement: option?.value || '',
						})
					}
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
						onChange={(value: string) =>
							onChange({
								...currentNavigationItem,
								description: value,
							})
						}
						value={currentNavigationItem.description || undefined}
					/>
				</FormGroup>
			)}
			{enableIcons && (
				<FormGroup
					label={tText('admin/menu/components/menu-edit-form/menu-edit-form___icoon')}
				>
					<IconPicker
						options={GET_ADMIN_ICON_OPTIONS()}
						onChange={(option: any) =>
							onChange({
								...currentNavigationItem,
								iconName: option?.value || '',
							})
						}
						value={GET_ADMIN_ICON_OPTIONS().find(
							(option: ReactSelectOption<string>) =>
								option.value === currentNavigationItem.iconName
						)}
					/>
				</FormGroup>
			)}
			<FormGroup
				error={formErrors.label}
				label={tText('admin/menu/components/menu-edit-form/menu-edit-form___label')}
			>
				<TextInput
					onChange={(value: string) =>
						onChange({
							...currentNavigationItem,
							label: value,
						})
					}
					value={currentNavigationItem.label || undefined}
				/>
			</FormGroup>
			<FormGroup
				error={formErrors.tooltip}
				label={tText('admin/menu/components/menu-edit-form/menu-edit-form___tooltip')}
			>
				<TextInput
					onChange={(value: string) =>
						onChange({
							...currentNavigationItem,
							tooltip: value,
						})
					}
					value={currentNavigationItem.tooltip || undefined}
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
						currentNavigationItem.contentType && currentNavigationItem.contentPath
							? {
									type: currentNavigationItem.contentType as Avo.Core.ContentPickerType,
									label: currentNavigationItem.contentPath.toString(),
									value: currentNavigationItem.contentPath.toString(),
									target: currentNavigationItem.linkTarget || undefined,
							  }
							: undefined
					}
					onChange={(item: any) => {
						if (!item) {
							onChange({
								...currentNavigationItem,
								contentType: null,
								contentPath: null,
								linkTarget: null,
							});
						} else {
							onChange({
								...currentNavigationItem,
								contentType: item.type,
								contentPath: item.value,
								linkTarget: item.target,
							});
						}
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
								(option) =>
									option.value === (currentNavigationItem.language || Locale.Nl)
							) || languageOptions[0]
						}
						onChange={(evt) =>
							onChange({
								...currentNavigationItem,
								language: (evt as SelectOption).value as Locale,
							})
						}
					/>
				</FormGroup>
			)}
			<Grid>
				<Column size="2-5">
					{allUserGroupOptions?.length && (
						<UserGroupSelect
							label={tText(
								'admin/menu/components/menu-edit-form/menu-edit-form___zichtbaar-voor'
							)}
							error={formErrors.userGroupIds}
							placeholder={tText(
								'admin/menu/components/menu-edit-form/menu-edit-form___niemand'
							)}
							values={currentNavigationItem.userGroupIds || []}
							required={false}
							onChange={(userGroupIds: string[]) =>
								onChange({ ...currentNavigationItem, userGroupIds: userGroupIds })
							}
							checkedOptions={
								currentNavigationItem?.id
									? []
									: [
											SpecialPermissionGroups.loggedOutUsers,
											SpecialPermissionGroups.loggedInUsers,
									  ]
							}
						/>
					)}
				</Column>
				<Column size="2-7" className="c-navigation-edit-form__warnings">
					{currentNavigationItem.contentType === 'INTERNAL_LINK' && (
						<Alert
							message={tHtml(
								'modules/navigation/components/navigation-edit-form/navigation-edit-form___opgelet-voor-statische-links-moet-je-zelf-zorgen-dat-de-geselecteerde-gebruikersgroepen-overeen-komen-met-wie-toegang-heeft-tot-die-statische-pagina'
							)}
							type="warn"
						/>
					)}
					{permissionWarning && <Alert message={permissionWarning} type="danger" />}
				</Column>
			</Grid>
		</Form>
	);
};
