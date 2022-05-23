import { compact, get, isEqual, isNil, startCase, uniq, uniqBy, without } from 'lodash-es';
import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react';

import {
	Badge,
	Button,
	ButtonToolbar,
	Flex,
	IconName,
	Spacer,
	Spinner,
	TagInfo,
} from '@viaa/avo2-components';

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
import { Config, ToastType } from '~core/config';
import { SpecialPermissionGroups } from '~modules/shared/types/authentication.types';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { navigate } from '~modules/shared/helpers/link';
import { PickerItem } from '~modules/shared/types/content-picker';
import { ValueOf } from '~modules/shared/types';
import { useUserGroupOptions } from '~modules/user-group/hooks/useUserGroupOptions';
import { ADMIN_PATH } from '~modules/shared/consts/admin.const';
import { dataService } from '~modules/shared/services/data-service';
import { CONTENT_PAGE_QUERIES } from '~modules/content-page/queries/content-pages.queries';
import { AdminLayout } from '~modules/shared/layouts';

interface NavigationEditProps {
	navigationBarId: string;
	navigationItemId: string | undefined;
}

const NavigationEdit: FC<NavigationEditProps> = ({ navigationBarId, navigationItemId }) => {
	const { t } = useTranslation();
	const history = Config.getConfig().services.router.useHistory();

	const navigationBarName = startCase(navigationBarId);

	// Hooks
	const [navigationItem, setNavigationItem] = useState<NavigationItem>(
		INITIAL_NAVIGATION_FORM(navigationBarId ? String(navigationBarId) : '0') as NavigationItem
	);
	const [initialNavigationItem, setInitialNavigationItem] = useState<NavigationItem | null>(null);
	const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
	const [formErrors, setFormErrors] = useState<NavigationEditFormErrorState>({});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [permissionWarning, setPermissionWarning] = useState<ReactNode | null>(null);
	const [allUserGroups] = useUserGroupOptions('TagInfo', true) as [TagInfo[], boolean];
	const [initialNavigationItems, setInitialNavigationItems] = useState<NavigationItem[] | null>(
		null
	);

	const getQueries = () => {
		return CONTENT_PAGE_QUERIES[Config.getConfig().database.databaseApplicationType];
	};

	// Fetch menu items depending on menu parent param
	// This is necessary for populating the menu parent options for our form
	useEffect(() => {
		NavigationService.fetchNavigationItems(navigationBarId)
			.then((menuItemsByPosition) => {
				if (menuItemsByPosition && menuItemsByPosition.length) {
					setInitialNavigationItems(menuItemsByPosition);
					setNavigationItems(menuItemsByPosition);
				} else {
					// Go back to overview if no menu items are present
					Config.getConfig().services.toastService.showToast({
						title: Config.getConfig().services.i18n.t('Error'),
						description: Config.getConfig().services.i18n.t(
							'admin/menu/views/menu-edit___er-werden-geen-navigatie-items-gevonden-voor-menu-name',
							{
								menuName: navigationBarName,
							}
						),
						type: ToastType.ERROR,
					});
					history.push(NAVIGATION_PATH.NAVIGATION_OVERVIEW);
				}
			})
			.catch((err) => {
				console.error(new CustomError('Failed to fetch menu items', err));
				Config.getConfig().services.toastService.showToast({
					title: Config.getConfig().services.i18n.t('Error'),
					description: Config.getConfig().services.i18n.t(
						'admin/menu/views/menu-edit___het-ophalen-van-de-menu-items-is-mislukt'
					),
					type: ToastType.ERROR,
				});
			});
	}, [history, navigationBarName, navigationBarId, t]);

	// Fetch menu item by id
	useEffect(() => {
		if (navigationItemId) {
			setIsLoading(true);
			// Fetch menu item by id so we can populate our form for editing
			NavigationService.fetchNavigationItemById(navigationItemId)
				.then((menuItem: NavigationItem | null) => {
					if (menuItem) {
						// Remove unnecessary props for saving
						delete (menuItem as any).__typename;

						setInitialNavigationItem(menuItem);
						setNavigationItem({
							description: menuItem.description || '',
							icon_name: menuItem.icon_name as IconName,
							label: menuItem.label,
							content_type: menuItem.content_type || 'COLLECTION',
							content_path: String(menuItem.content_path || ''),
							link_target: menuItem.link_target || '_self',
							user_group_ids: menuItem.user_group_ids || [],
							placement: menuItem.placement || null,
							tooltip: menuItem.tooltip,
						} as NavigationItem);
					}
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [navigationItemId, navigationBarId]);

	const checkMenuItemContentPagePermissionsMismatch = useCallback(
		(response) => {
			let contentUserGroupIds: string[] =
				get(response, 'data.app_content[0].user_group_ids') ||
				get(response, 'data.app_content_page[0].user_group_ids') ||
				[];
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
								{t(
									'admin/menu/views/menu-edit___het-navigatie-item-zal-zichtbaar-zijn-voor-gebruikers-die-geen-toegang-hebben-tot-de-geselecteerde-pagina'
								)}
							</>
						</Spacer>
						<Spacer margin="bottom-small">
							<>
								{t(
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
		[setPermissionWarning, navigationItem.user_group_ids, allUserGroups, t]
	);

	// Check if the navigation item is visible for users that do not have access to the selected content page
	// TODO -- skipped for  now
	useEffect(() => {
		if (navigationItem.content_type === 'CONTENT_PAGE' && navigationItem.content_path) {
			// Check if permissions are more strict than the permissions on the content_page
			dataService
				.query({
					query: getQueries().GetPermissionsFromContentPageByPathDocument,
					variables: {
						path: navigationItem.content_path,
					},
				})
				.then((response) => {
					checkMenuItemContentPagePermissionsMismatch(response);
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
					Config.getConfig().services.toastService.showToast({
						title: Config.getConfig().services.i18n.t('Error'),
						description: Config.getConfig().services.i18n.t(
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
		t,
	]);

	// Computed
	const pageType: NavigationEditPageType = navigationItemId ? 'edit' : 'create';
	const menuParentOptions = uniqBy(
		compact(
			navigationItems.map((menuItem) => {
				if (!menuItem.placement) {
					return null;
				}
				return {
					label: startCase(menuItem.placement || ''),
					value: menuItem.placement,
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
				Config.getConfig().services.toastService.showToast({
					title: Config.getConfig().services.i18n.t('Success'),
					description: Config.getConfig().services.i18n.t(
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
				Config.getConfig().services.toastService.showToast({
					title: Config.getConfig().services.i18n.t('Success'),
					description: Config.getConfig().services.i18n.t(
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
			Config.getConfig().services.toastService.showToast({
				title: Config.getConfig().services.i18n.t('Error'),
				description: Config.getConfig().services.i18n.t(
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
			errors.placement = t('admin/menu/views/menu-edit___navigatie-naam-is-verplicht');
		}

		if (!navigationItem.content_path) {
			errors.content_path = t('admin/menu/views/menu-edit___link-is-verplicht');
		}

		setFormErrors(errors);

		return Object.keys(errors).length === 0;
	};

	// Render
	const pageTitle = navigationBarId
		? `${navigationBarName}: item ${GET_PAGE_TYPES_LANG()[pageType]}`
		: t('admin/menu/views/menu-edit___navigatie-toevoegen');
	return isLoading ? (
		<Flex orientation="horizontal" center>
			<Spinner size="large" />
		</Flex>
	) : (
		<AdminLayout pageTitle={pageTitle}>
			<AdminLayout.Actions>
				<ButtonToolbar>
					<Button
						label={t('admin/menu/views/menu-detail___annuleer')}
						onClick={() => history.push(NAVIGATION_PATH.NAVIGATION_OVERVIEW)}
						type="tertiary"
					/>
					<Button
						disabled={isSaving}
						label={t('admin/menu/views/menu-detail___opslaan')}
						onClick={() => handleSave()}
					/>
				</ButtonToolbar>
			</AdminLayout.Actions>
			<AdminLayout.Content>
				<NavigationEditForm
					formErrors={formErrors}
					formState={navigationItem}
					navigationParentId={navigationBarId}
					navigationParentOptions={menuParentOptions}
					onChange={handleChange}
					permissionWarning={permissionWarning}
				/>
			</AdminLayout.Content>
		</AdminLayout>
	);
};

export default NavigationEdit;
