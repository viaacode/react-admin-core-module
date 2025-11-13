import type { TagInfo } from '@viaa/avo2-components';
import { Button, ButtonToolbar, Flex } from '@viaa/avo2-components';
import { compact, isNil, startCase, uniqBy } from 'es-toolkit';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { AdminConfigManager } from '~core/config/config.class';
import { ToastType } from '~core/config/config.types';
import { blockHasErrors } from '~modules/content-page/helpers/block-has-errors';
import { useGetNavigationBarItems } from '~modules/navigation/hooks/use-get-navigation-bar-items';
import { Locale } from '~modules/translations/translations.core.types';
import { useUserGroupOptions } from '~modules/user-group/hooks/useUserGroupOptions';
import type { UserGroup } from '~modules/user-group/types/user-group.types';
import { Icon } from '~shared/components/Icon/Icon';
import { CenteredSpinner } from '~shared/components/Spinner/CenteredSpinner';
import { CustomError } from '~shared/helpers/custom-error';
import { navigate } from '~shared/helpers/link';
import { showToast } from '~shared/helpers/show-toast';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import { AdminLayout } from '~shared/layouts/AdminLayout/AdminLayout';

import { NavigationEditForm } from '../components/NavigationEditForm/NavigationEditForm';
import { GET_PAGE_TYPES_LANG } from '../navigation.consts';
import { NavigationService } from '../navigation.service';
import type { NavigationEditFormErrorState, NavigationItem } from '../navigation.types';
import { NavigationEditPageType } from '../navigation.types';

interface NavigationEditProps {
	navigationBarId: string;
	navigationItemId: string | undefined;
	onGoBack: () => void;
}

export const NavigationItemEdit: FC<NavigationEditProps> = ({
	navigationBarId,
	navigationItemId,
	onGoBack,
}) => {
	const navigateFunc = AdminConfigManager.getConfig().services.router.navigateFunc;

	const navigationBarName = startCase(navigationBarId);

	// Hooks
	const [currentNavigationItem, setCurrentCurrentNavigationItem] = useState<NavigationItem | null>(
		null
	);
	const [formErrors, setFormErrors] = useState<NavigationEditFormErrorState>({});
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [allUserGroups] = useUserGroupOptions('TagInfo', true, false) as [
		TagInfo[],
		UserGroup[],
		boolean,
	];
	const {
		data: navigationItems,
		isLoading: isLoadingNavigationItems,
		isError: isErrorNavigationItems,
	} = useGetNavigationBarItems(navigationBarId, undefined, undefined, undefined, undefined, {
		gcTime: 0,
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
		(navItem) => navItem.value
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
				language: Locale.Nl,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};
			setCurrentCurrentNavigationItem(newNavigationItem);
		}
	}, [navigationBarId, navigationItemId, isLoadingNavigationItems, originalNavigationItem]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: TODO need to test the application before changing these dep arrays
	useEffect(() => {
		if (
			!isLoadingNavigationItems &&
			!isErrorNavigationItems &&
			pageType === NavigationEditPageType.edit &&
			!navigationItems?.length
		) {
			// Go back to overview if no menu items are present
			showToast({
				type: ToastType.ERROR,
				title: tText('modules/navigation/views/navigation-edit___error'),
				description: tText(
					'admin/menu/views/menu-edit___er-werden-geen-navigatie-items-gevonden-voor-menu-name',
					{
						menuName: navigationBarName,
					}
				),
			});

			navigateFunc(AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_OVERVIEW'));
		}
	}, [
		isLoadingNavigationItems,
		isErrorNavigationItems,
		navigationItems,
		navigationBarName,
		pageType,
		history,
	]);

	// Methods
	const handleSave = async () => {
		try {
			if (!navigationItems) {
				showToast({
					type: ToastType.ERROR,
					title: tText('modules/navigation/views/navigation-edit___error'),
					description: tText(
						'modules/navigation/views/navigation-edit___er-zijn-geen-navigatie-items-om-op-te-slaan'
					),
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
					description:
						navigationItems?.[0]?.description || currentNavigationItem?.description || '',
					position: navigationItems.length,
				});

				navigate(navigateFunc, AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_DETAIL'), {
					navigationBarId: currentNavigationItem?.placement as string,
				});

				showToast({
					type: ToastType.SUCCESS,
					title: tText('modules/navigation/views/navigation-edit___success'),
					description: tText(
						'admin/menu/views/menu-edit___het-navigatie-item-is-succesvol-aangemaakt'
					),
				});
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

				navigate(navigateFunc, AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_DETAIL'), {
					navigationBarId: currentNavigationItem?.placement as string,
				});

				showToast({
					type: ToastType.SUCCESS,
					title: tText('modules/navigation/views/navigation-edit___success'),
					description: tText(
						'admin/menu/views/menu-edit___het-navigatie-item-is-succesvol-geupdatet'
					),
				});
			}
		} catch (err) {
			console.error(
				new CustomError('Failed to save menu item', err, {
					menuForm: currentNavigationItem,
				})
			);

			showToast({
				type: ToastType.ERROR,
				title: tText('modules/navigation/views/navigation-edit___error'),
				description: tText(
					'admin/menu/views/menu-edit___het-updaten-van-het-navigatie-item-is-mislukt'
				),
			});
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
					<Button type="borderless" onClick={onGoBack}>
						<Icon name="chevronLeft"></Icon>
					</Button>
				</AdminLayout.Back>
				<AdminLayout.Actions>
					<ButtonToolbar>
						<Button
							label={tText('admin/menu/views/menu-detail___annuleer')}
							onClick={() =>
								navigateFunc(AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_OVERVIEW'))
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
								currentNavigationItem={currentNavigationItem}
								navigationParentId={navigationBarId}
								navigationParentOptions={navigationParentOptions}
								onChange={setCurrentCurrentNavigationItem}
								allUserGroups={allUserGroups}
								enableIcons={AdminConfigManager.getConfig().navigationBars?.enableIcons ?? true}
							/>
						)}
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return renderPageContent();
};
