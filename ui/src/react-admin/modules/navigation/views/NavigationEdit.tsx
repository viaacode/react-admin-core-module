import { compact, get, isNil, startCase, uniq, uniqBy, without } from 'lodash-es';
import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react';

import {
	Badge,
	Button,
	ButtonToolbar,
	Flex,
	Spacer,
	Spinner,
	TagInfo,
} from '@viaa/avo2-components';
import { ContentPageService } from '~modules/content-page/services/content-page.service';

import { NavigationEditForm } from '../components';
import {
	GET_PAGE_TYPES_LANG,
	INITIAL_NAVIGATION_FORM,
	NAVIGATION_PATH,
} from '../navigation.consts';
import { NavigationService } from '../navigation.service';
import {
	NavigationEditFormErrorState,
	NavigationEditPageType,
	NavigationItem,
} from '../navigation.types';
import { useTranslation } from '~modules/shared/hooks/useTranslation';
import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { SpecialPermissionGroups } from '~modules/shared/types/authentication.types';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { navigate } from '~modules/shared/helpers/link';
import { PickerItem } from '~modules/shared/types/content-picker';
import { ValueOf } from '~modules/shared/types';
import { useUserGroupOptions } from '~modules/user-group/hooks/useUserGroupOptions';
import { ADMIN_PATH } from '~modules/shared/consts/admin.const';
import { AdminLayout } from '~modules/shared/layouts';
import { useGetNavigationBarItems } from '~modules/navigation/hooks/use-get-navigation-bar-items';
import { useGetNavigationItem } from '~modules/navigation/hooks/use-get-navigation-item';

interface NavigationEditProps {
	navigationBarId: string;
	navigationItemId: string | undefined;
}

const NavigationEdit: FC<NavigationEditProps> = ({ navigationBarId, navigationItemId }) => {
	const { tHtml, tText } = useTranslation();
	const history = AdminConfigManager.getConfig().services.router.useHistory();

	const navigationBarName = startCase(navigationBarId);

	// Hooks
	const [navigationItem, setNavigationItem] = useState<NavigationItem>(
		INITIAL_NAVIGATION_FORM(navigationBarId ? String(navigationBarId) : '0') as NavigationItem
	);
	const [formErrors, setFormErrors] = useState<NavigationEditFormErrorState>({});
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [permissionWarning, setPermissionWarning] = useState<ReactNode | null>(null);
	const [allUserGroups] = useUserGroupOptions('TagInfo', true) as [TagInfo[], boolean];
	const {
		data: navigationItems,
		isLoading: isLoadingNavigationItems,
		isError: isErrorNavigationItems,
	} = useGetNavigationBarItems(navigationBarId);
	const {
		data: initialNavigationItem,
		isLoading: isLoadingNavigationItem,
		isError: isErrorNavigationItem,
	} = useGetNavigationItem(navigationItemId);

	useEffect(() => {
		if (initialNavigationItem) {
			setNavigationItem(initialNavigationItem);
		}
	}, [initialNavigationItem]);

	useEffect(() => {
		if (!isLoadingNavigationItems && !isErrorNavigationItems && !navigationItems?.length) {
			// Go back to overview if no menu items are present
			AdminConfigManager.getConfig().services.toastService.showToast({
				title: tText('modules/navigation/views/navigation-edit___error'),
				description: tText(
					'admin/menu/views/menu-edit___er-werden-geen-navigatie-items-gevonden-voor-menu-name',
					{
						menuName: navigationBarName,
					}
				),
				type: ToastType.ERROR,
			});
			history.push(NAVIGATION_PATH.NAVIGATION_OVERVIEW);
		}
	}, [
		isLoadingNavigationItems,
		isErrorNavigationItems,
		navigationItems,
		navigationBarName,
		history,
		tText,
	]);

	const checkMenuItemContentPagePermissionsMismatch = useCallback(
		(contentUserGroupIds) => {
			const navItemUserGroupIds: string[] = navigationItem.user_group_ids || [];
			const allUserGroupIds: string[] = allUserGroups.map((ug) => ug.value as string);

			// Add all user groups to content page user groups if content page is accessible by special user group: logged in users
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
						return get(faultyUserGroup, 'label', null);
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
		[setPermissionWarning, navigationItem.user_group_ids, allUserGroups, tHtml]
	);

	// Check if the navigation item is visible for users that do not have access to the selected content page
	// TODO -- skipped for  now
	useEffect(() => {
		if (navigationItem.content_type === 'CONTENT_PAGE' && navigationItem.content_path) {
			// Check if permissions are stricter than the permissions on the content_page
			ContentPageService.getUserGroupsWithAccessToContentPage(navigationItem.content_path)
				.then((userGroupIds) => {
					checkMenuItemContentPagePermissionsMismatch(userGroupIds);
				})
				.catch((err) => {
					console.error(
						new CustomError('Failed to get permissions from page', err, {
							query: 'GET_PERMISSIONS_FROM_CONTENT_PAGE_BY_PATH',
							variables: {
								path: navigationItem.content_path,
							},
						})
					);
					AdminConfigManager.getConfig().services.toastService.showToast({
						title: tText('modules/navigation/views/navigation-edit___error'),
						description: tText(
							'admin/menu/views/menu-edit___het-controleren-of-de-permissies-van-de-pagina-overeenkomen-met-de-zichtbaarheid-van-dit-navigatie-item-is-mislukt'
						),
						type: ToastType.ERROR,
					});
				});
		}
	}, [
		navigationItem.content_type,
		navigationItem.content_path,
		navigationItem.user_group_ids,
		checkMenuItemContentPagePermissionsMismatch,
		tText,
	]);

	// Computed
	const pageType: NavigationEditPageType = navigationItemId ? 'edit' : 'create';
	const navigationParentOptions = uniqBy(
		compact(
			(navigationItems || []).map((navigationItem) => {
				if (!navigationItem.placement) {
					return null;
				}
				return {
					label: startCase(navigationItem.placement || ''),
					value: navigationItem.placement,
				};
			})
		),
		'value'
	);

	// Methods
	const handleChange = (
		key: keyof NavigationItem | 'content',
		value: ValueOf<NavigationItem> | PickerItem | null
	): void => {
		if (key === 'content') {
			setNavigationItem({
				...navigationItem,
				content_type: get(value, 'type'),
				content_path: get(value, 'value'),
				link_target: get(value, 'target', '_self'),
			});
		} else {
			setNavigationItem({
				...navigationItem,
				[key]: value,
			});
		}
	};

	const handleSave = async () => {
		try {
			if (!navigationItems) {
				AdminConfigManager.getConfig().services.toastService.showToast({
					title: tText('modules/navigation/views/navigation-edit___error'),
					description: tText(
						'modules/navigation/views/navigation-edit___er-zijn-geen-navigatie-items-om-op-te-slaan'
					),
					type: ToastType.ERROR,
				});
				return;
			}

			setIsSaving(true);

			// Validate form
			const isFormValid = handleValidation();

			if (!isFormValid) {
				setIsSaving(false);

				return;
			}

			const menuItem: Partial<NavigationItem> = {
				icon_name: navigationItem.icon_name,
				label: navigationItem.label,
				content_path: navigationItem.content_path,
				content_type: navigationItem.content_type,
				link_target: navigationItem.link_target,
				user_group_ids: navigationItem.user_group_ids,
				placement: navigationItem.placement,
				tooltip: navigationItem.tooltip,
			};

			if (pageType === 'create') {
				await NavigationService.insertNavigationItem({
					...menuItem,
					// Get description from existing items or use form description field
					description: get(
						navigationItems,
						'[0].description',
						navigationItem.description
					),
					position: navigationItems.length,
				});
				navigate(history, ADMIN_PATH.NAVIGATION_DETAIL, {
					navigationBarId: navigationItem.placement as string,
				});
				AdminConfigManager.getConfig().services.toastService.showToast({
					title: tText('modules/navigation/views/navigation-edit___success'),
					description: tText(
						'admin/menu/views/menu-edit___het-navigatie-item-is-succesvol-aangemaakt'
					),
					type: ToastType.SUCCESS,
				});
			} else {
				if (isNil(navigationItemId)) {
					throw new CustomError('cannot update menu item because id is undefined', null, {
						navigationItemId,
					});
				}
				await NavigationService.updateNavigationItems([
					{
						...initialNavigationItem,
						...menuItem,
						id: navigationItemId as string,
						updated_at: new Date().toISOString(),
					} as NavigationItem,
				]);
				navigate(history, ADMIN_PATH.NAVIGATION_DETAIL, {
					navigationBarId: navigationItem.placement as string,
				});
				AdminConfigManager.getConfig().services.toastService.showToast({
					title: tText('modules/navigation/views/navigation-edit___success'),
					description: tText(
						'admin/menu/views/menu-edit___het-navigatie-item-is-succesvol-geupdatet'
					),
					type: ToastType.SUCCESS,
				});
			}
		} catch (err) {
			console.error(
				new CustomError('Failed to save menu item', err, {
					menuForm: navigationItem,
				})
			);
			AdminConfigManager.getConfig().services.toastService.showToast({
				title: tText('modules/navigation/views/navigation-edit___error'),
				description: tText(
					'admin/menu/views/menu-edit___het-updaten-van-het-navigatie-item-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}
		setIsSaving(false);
	};

	const handleValidation = (): boolean => {
		const errors: NavigationEditFormErrorState = {};

		if (!navigationBarId && !navigationItem.placement) {
			errors.placement = tText('admin/menu/views/menu-edit___navigatie-naam-is-verplicht');
		}

		if (!navigationItem.content_path) {
			errors.content_path = tText('admin/menu/views/menu-edit___link-is-verplicht');
		}

		setFormErrors(errors);

		return Object.keys(errors).length === 0;
	};

	const renderPageContent = () => {
		if (isLoadingNavigationItems || isLoadingNavigationItem) {
			return (
				<Flex orientation="horizontal" center>
					<Spinner size="large" />
				</Flex>
			);
		}
		if (isErrorNavigationItems || isErrorNavigationItem) {
			return (
				<Flex orientation="horizontal" center>
					{tHtml('admin/menu/views/menu-edit___het-ophalen-van-de-menu-items-is-mislukt')}
				</Flex>
			);
		}
		const pageTitle = navigationBarId
			? `${navigationBarName}: ${tText('modules/navigation/views/navigation-edit___item')} ${
					GET_PAGE_TYPES_LANG()[pageType]
			  }`
			: tText('admin/menu/views/menu-edit___navigatie-toevoegen');
		return (
			<AdminLayout pageTitle={pageTitle}>
				<AdminLayout.Actions>
					<ButtonToolbar>
						<Button
							label={tText('admin/menu/views/menu-detail___annuleer')}
							onClick={() => history.push(NAVIGATION_PATH.NAVIGATION_OVERVIEW)}
							type="tertiary"
						/>
						<Button
							disabled={isSaving}
							label={tText('admin/menu/views/menu-detail___opslaan')}
							onClick={() => handleSave()}
						/>
					</ButtonToolbar>
				</AdminLayout.Actions>
				<AdminLayout.Content>
					<NavigationEditForm
						formErrors={formErrors}
						formState={navigationItem}
						navigationParentId={navigationBarId}
						navigationParentOptions={navigationParentOptions}
						onChange={handleChange}
						permissionWarning={permissionWarning}
						enableIcons={
							AdminConfigManager.getConfig().navigationBars?.enableIcons ?? true
						}
					/>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return renderPageContent();
};

export default NavigationEdit;
