import { Badge, Button, ButtonToolbar, Flex, Spacer, TagInfo } from '@viaa/avo2-components';
import { compact, get, isNil, startCase, uniq, uniqBy, without } from 'lodash-es';
import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react';
import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { blockHasErrors } from '~modules/content-page/helpers/block-has-errors';
import { ContentPageService } from '~modules/content-page/services/content-page.service';
import { useGetNavigationBarItems } from '~modules/navigation/hooks/use-get-navigation-bar-items';
import { Link } from '~modules/shared/components/Link';
import { LanguageCode } from '~modules/translations/translations.core.types';
import { useUserGroupOptions } from '~modules/user-group/hooks/useUserGroupOptions';
import { UserGroup } from '~modules/user-group/types/user-group.types';
import { Icon } from '~shared/components';
import { CenteredSpinner } from '~shared/components/Spinner/CenteredSpinner';
import { CustomError } from '~shared/helpers/custom-error';
import { navigate } from '~shared/helpers/link';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import { AdminLayout } from '~shared/layouts';
import { ValueOf } from '~shared/types';
import { SpecialPermissionGroups } from '~shared/types/authentication.types';
import { PickerItem } from '~shared/types/content-picker';

import { NavigationEditForm } from '../components';
import { GET_PAGE_TYPES_LANG } from '../navigation.consts';
import { NavigationService } from '../navigation.service';
import {
	NavigationEditFormErrorState,
	NavigationEditPageType,
	NavigationItem,
} from '../navigation.types';

interface NavigationEditProps {
	navigationBarId: string;
	navigationItemId: string | undefined;
}

const NavigationItemEdit: FC<NavigationEditProps> = ({ navigationBarId, navigationItemId }) => {
	const history = AdminConfigManager.getConfig().services.router.useHistory();

	const navigationBarName = startCase(navigationBarId);

	// Hooks
	const [currentNavigationItem, setCurrentCurrentNavigationItem] =
		useState<NavigationItem | null>(null);
	const [formErrors, setFormErrors] = useState<NavigationEditFormErrorState>({});
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [permissionWarning, setPermissionWarning] = useState<ReactNode | null>(null);
	const [allUserGroups] = useUserGroupOptions('TagInfo', true, false) as [
		TagInfo[],
		UserGroup[],
		boolean,
	];
	const {
		data: navigationItems,
		isLoading: isLoadingNavigationItems,
		isError: isErrorNavigationItems,
	} = useGetNavigationBarItems(navigationBarId, undefined, undefined, {
		keepPreviousData: false,
		cacheTime: 0,
	});
	const originalNavigationItem =
		navigationItems?.find((navItem) => String(navItem.id) === navigationItemId) || null;

	// Computed
	const pageType: NavigationEditPageType = navigationItemId
		? NavigationEditPageType.edit
		: NavigationEditPageType.create;
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

	useEffect(() => {
		if (isLoadingNavigationItems) {
			return;
		}
		if (originalNavigationItem) {
			setCurrentCurrentNavigationItem(originalNavigationItem);
		} else if (!navigationItemId) {
			const newNavigationItem: NavigationItem = {
				id: '',
				description: '',
				placement: navigationBarId,
				tooltip: null,
				iconName: '',
				label: null,
				userGroupIds: null,
				contentType: null,
				contentPath: null,
				linkTarget: null,
				position: 0,
				language: LanguageCode.Nl,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};
			setCurrentCurrentNavigationItem(newNavigationItem);
		}
	}, [
		navigationBarId,
		navigationItemId,
		isLoadingNavigationItems,
		navigationItems,
		originalNavigationItem,
		setCurrentCurrentNavigationItem,
	]);

	useEffect(() => {
		if (
			!isLoadingNavigationItems &&
			!isErrorNavigationItems &&
			pageType === NavigationEditPageType.edit &&
			!navigationItems?.length
		) {
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

			history.push(AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_OVERVIEW'));
		}
	}, [
		isLoadingNavigationItems,
		isErrorNavigationItems,
		navigationItems,
		navigationBarName,
		pageType,
		history,
	]);

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
		[setPermissionWarning, currentNavigationItem, allUserGroups]
	);

	// Check if the navigation item is visible for users that do not have access to the selected content page
	// TODO -- skipped for  now
	useEffect(() => {
		if (!currentNavigationItem) {
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

					showToast(
						ToastType.ERROR,
						tText('modules/navigation/views/navigation-edit___error'),
						tText(
							'admin/menu/views/menu-edit___het-controleren-of-de-permissies-van-de-pagina-overeenkomen-met-de-zichtbaarheid-van-dit-navigatie-item-is-mislukt'
						)
					);
				});
		}
	}, [currentNavigationItem, checkMenuItemContentPagePermissionsMismatch]);

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
		if (!currentNavigationItem) {
			return;
		}
		if (key === 'content') {
			const pickerValue = value as PickerItem | null;
			setCurrentCurrentNavigationItem({
				...currentNavigationItem,
				contentType: pickerValue?.type ?? null,
				contentPath: pickerValue?.value || null,
				linkTarget: pickerValue?.target || '_self',
			});
		} else {
			setCurrentCurrentNavigationItem({
				...currentNavigationItem,
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
				iconName: currentNavigationItem?.iconName,
				label: currentNavigationItem?.label,
				contentPath: currentNavigationItem?.contentPath,
				contentType: currentNavigationItem?.contentType,
				linkTarget: currentNavigationItem?.linkTarget,
				userGroupIds: currentNavigationItem?.userGroupIds,
				placement: currentNavigationItem?.placement,
				tooltip: currentNavigationItem?.tooltip,
				language: currentNavigationItem?.language,
			};

			// Create new navigation item
			if (pageType === 'create') {
				await NavigationService.insertNavigationItem({
					...menuItem,
					// Get description from existing items or use form description field
					description: get(
						navigationItems,
						'[0].description',
						currentNavigationItem?.description || ''
					),
					position: navigationItems.length,
				});

				navigate(history, AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_DETAIL'), {
					navigationBarId: currentNavigationItem?.placement as string,
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
						...originalNavigationItem,
						...menuItem,
						id: navigationItemId as string,
						updated_at: new Date().toISOString(),
					} as NavigationItem,
				]);

				navigate(history, AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_DETAIL'), {
					navigationBarId: currentNavigationItem?.placement as string,
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
					menuForm: currentNavigationItem,
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

		if (!navigationBarId && !currentNavigationItem?.placement) {
			errors.placement = tText('admin/menu/views/menu-edit___navigatie-naam-is-verplicht');
		}

		if (!currentNavigationItem?.contentPath) {
			errors.contentPath = tText('admin/menu/views/menu-edit___link-is-verplicht');
		}

		setFormErrors(errors);

		return !blockHasErrors(errors);
	};

	const renderPageContent = () => {
		if (isLoadingNavigationItems) {
			return <CenteredSpinner />;
		}
		if (isErrorNavigationItems) {
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
				<AdminLayout.Back>
					<Link to={AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_OVERVIEW')}>
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
									AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_OVERVIEW')
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
						{currentNavigationItem && (
							<NavigationEditForm
								formErrors={formErrors}
								formState={currentNavigationItem}
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

export default NavigationItemEdit;
