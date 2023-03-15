import { compact, get, isNil, startCase, uniq, uniqBy, without } from 'lodash-es';
import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react';

import { Badge, Button, ButtonToolbar, Flex, Spacer, TagInfo } from '@viaa/avo2-components';
import { ContentPageService } from '~modules/content-page/services/content-page.service';
import { Icon } from '~shared/components';
import { CenteredSpinner } from '~shared/components/Spinner/CenteredSpinner';
import { UserGroup } from '~modules/user-group/types/user-group.types';

import { NavigationEditForm } from '../components';
import { GET_PAGE_TYPES_LANG } from '../navigation.consts';
import { NavigationService } from '../navigation.service';
import {
	NavigationEditFormErrorState,
	NavigationEditPageType,
	NavigationItem,
} from '../navigation.types';
import { useTranslation } from '~shared/hooks/useTranslation';
import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { SpecialPermissionGroups } from '~shared/types/authentication.types';
import { CustomError } from '~shared/helpers/custom-error';
import { navigate } from '~shared/helpers/link';
import { PickerItem } from '~shared/types/content-picker';
import { ValueOf } from '~shared/types';
import { useUserGroupOptions } from '~modules/user-group/hooks/useUserGroupOptions';
import { AdminLayout } from '~shared/layouts';
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
	const [navigationItem, setNavigationItem] = useState<NavigationItem | null>(null);
	const [formErrors, setFormErrors] = useState<NavigationEditFormErrorState>({});
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [permissionWarning, setPermissionWarning] = useState<ReactNode | null>(null);
	const [allUserGroups] = useUserGroupOptions('TagInfo', true, false) as [
		TagInfo[],
		UserGroup[],
		boolean
	];
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
		if (initialNavigationItem && navigationBarId && !isLoadingNavigationItem) {
			setNavigationItem(initialNavigationItem);
		}
	}, [initialNavigationItem, navigationBarId, isLoadingNavigationItem]);

	useEffect(() => {
		if (!isLoadingNavigationItems && !isErrorNavigationItems && !navigationItems?.length) {
			// Go back to overview if no menu items are present
			showToast(
				ToastType.ERROR,
				tText('modules/navigation/views/navigation-edit___error'),
				tText(
					'admin/menu/views/menu-edit___er-werden-geen-navigatie-items-gevonden-voor-menu-name',
					{
						menuName: navigationBarName,
					}
				)
			);

			history.push(AdminConfigManager.getAdminRoute('NAVIGATION_OVERVIEW'));
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
			if (!navigationItem) {
				return;
			}
			const navItemUserGroupIds: string[] = navigationItem.userGroupIds || [];
			const allUserGroupIds: string[] = allUserGroups.map((ug) => String(ug.value));

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
		[setPermissionWarning, navigationItem?.userGroupIds, allUserGroups, tHtml]
	);

	// Check if the navigation item is visible for users that do not have access to the selected content page
	// TODO -- skipped for  now
	useEffect(() => {
		if (!navigationItem) {
			return;
		}
		if (navigationItem.contentType === 'CONTENT_PAGE' && navigationItem.contentPath) {
			// Check if permissions are stricter than the permissions on the content_page
			ContentPageService.getUserGroupsWithAccessToContentPage(navigationItem.contentPath)
				.then((userGroupIds) => {
					checkMenuItemContentPagePermissionsMismatch(userGroupIds);
				})
				.catch((err) => {
					console.error(
						new CustomError('Failed to get permissions from page', err, {
							query: 'GET_PERMISSIONS_FROM_CONTENT_PAGE_BY_PATH',
							variables: {
								path: navigationItem.contentPath,
							},
						})
					);

					showToast(
						ToastType.ERROR,
						tText('modules/navigation/views/navigation-edit___error'),
						tText(
							'admin/menu/views/menu-edit___het-controleren-of-de-permissies-van-de-pagina-overeenkomen-met-de-zichtbaarheid-van-dit-navigatie-item-is-mislukt'
						)
					);
				});
		}
	}, [navigationItem, checkMenuItemContentPagePermissionsMismatch, tText]);

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
	const showToast = (type: ToastType, title: string, description: string): void => {
		AdminConfigManager.getConfig().services.toastService.showToast({
			title,
			description,
			type,
		});
	};

	const handleChange = (
		key: keyof NavigationItem | 'content',
		value: ValueOf<NavigationItem> | PickerItem | null
	): void => {
		if (!navigationItem) {
			return;
		}
		if (key === 'content') {
			const pickerValue = value as PickerItem | null;
			setNavigationItem({
				...navigationItem,
				contentType: pickerValue?.type ?? null,
				contentPath: pickerValue?.value || null,
				linkTarget: pickerValue?.target || '_self',
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
				showToast(
					ToastType.ERROR,
					tText('modules/navigation/views/navigation-edit___error'),
					tText(
						'modules/navigation/views/navigation-edit___er-zijn-geen-navigatie-items-om-op-te-slaan'
					)
				);

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
				iconName: navigationItem?.iconName,
				label: navigationItem?.label,
				contentPath: navigationItem?.contentPath,
				contentType: navigationItem?.contentType,
				linkTarget: navigationItem?.linkTarget,
				userGroupIds: navigationItem?.userGroupIds,
				placement: navigationItem?.placement,
				tooltip: navigationItem?.tooltip,
			};

			// Create new navigation item
			if (pageType === 'create') {
				await NavigationService.insertNavigationItem({
					...menuItem,
					// Get description from existing items or use form description field
					description: get(
						navigationItems,
						'[0].description',
						navigationItem?.description || ''
					),
					position: navigationItems.length,
				});

				navigate(history, AdminConfigManager.getAdminRoute('NAVIGATION_DETAIL'), {
					navigationBarId: navigationItem?.placement as string,
				});

				showToast(
					ToastType.SUCCESS,
					tText('modules/navigation/views/navigation-edit___success'),
					tText('admin/menu/views/menu-edit___het-navigatie-item-is-succesvol-aangemaakt')
				);
			} else {
				// Update existing navigation item
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

				navigate(history, AdminConfigManager.getAdminRoute('NAVIGATION_DETAIL'), {
					navigationBarId: navigationItem?.placement as string,
				});

				showToast(
					ToastType.SUCCESS,
					tText('modules/navigation/views/navigation-edit___success'),
					tText('admin/menu/views/menu-edit___het-navigatie-item-is-succesvol-geupdatet')
				);
			}
		} catch (err) {
			console.error(
				new CustomError('Failed to save menu item', err, {
					menuForm: navigationItem,
				})
			);

			showToast(
				ToastType.ERROR,
				tText('modules/navigation/views/navigation-edit___error'),
				tText('admin/menu/views/menu-edit___het-updaten-van-het-navigatie-item-is-mislukt')
			);
		}

		setIsSaving(false);
	};

	const handleValidation = (): boolean => {
		const errors: NavigationEditFormErrorState = {};

		if (!navigationBarId && !navigationItem?.placement) {
			errors.placement = tText('admin/menu/views/menu-edit___navigatie-naam-is-verplicht');
		}

		if (!navigationItem?.contentPath) {
			errors.contentPath = tText('admin/menu/views/menu-edit___link-is-verplicht');
		}

		setFormErrors(errors);

		return Object.keys(errors).length === 0;
	};

	const renderPageContent = () => {
		if (isLoadingNavigationItems || isLoadingNavigationItem) {
			return <CenteredSpinner />;
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
		const Link = AdminConfigManager.getConfig().services.router.Link;
		return (
			<AdminLayout pageTitle={pageTitle}>
				<AdminLayout.Back>
					<Link to={AdminConfigManager.getAdminRoute('NAVIGATION_OVERVIEW')}>
						<Button type="borderless">
							<Icon name="chevronLeft"></Icon>
						</Button>
					</Link>
				</AdminLayout.Back>
				<AdminLayout.Actions>
					<ButtonToolbar>
						<Button
							label={tText('admin/menu/views/menu-detail___annuleer')}
							onClick={() =>
								history.push(
									AdminConfigManager.getAdminRoute('NAVIGATION_OVERVIEW')
								)
							}
							type="tertiary"
						/>
						<Button
							disabled={isSaving}
							label={tText('admin/menu/views/menu-detail___opslaan')}
							onClick={handleSave}
						/>
					</ButtonToolbar>
				</AdminLayout.Actions>
				<AdminLayout.Content>
					<div>
						{navigationItem && (
							<NavigationEditForm
								formErrors={formErrors}
								formState={navigationItem}
								navigationParentId={navigationBarId}
								navigationParentOptions={navigationParentOptions}
								onChange={handleChange}
								permissionWarning={permissionWarning}
								enableIcons={
									AdminConfigManager.getConfig().navigationBars?.enableIcons ??
									true
								}
							/>
						)}
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return renderPageContent();
};

export default NavigationEdit;
