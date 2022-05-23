import { compact, get, isNil, startCase, uniq, uniqBy, without } from 'lodash-es';
import React, { FunctionComponent, ReactNode, useCallback, useEffect, useState } from 'react';

import {
	Badge,
	ButtonToolbar,
	Flex,
	IconName,
	Spacer,
	Spinner,
	TagInfo,
} from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';

// import { GET_PERMISSIONS_FROM_CONTENT_PAGE_BY_PATH } from '../../content/content.gql';
import { NavigationEditForm } from '../components';
import {
	GET_PAGE_TYPES_LANG,
	INITIAL_NAVIGATION_FORM,
	NAVIGATION_PATH,
} from '../navigation.consts';
import { NavigationService } from '../navigation.service';
import { NavigationEditFormErrorState, NavigationEditPageType } from '../navigation.types';
import { useTranslation } from '~modules/shared/hooks/useTranslation';
import { Config, ToastType } from '~core/config';
import { SpecialPermissionGroups } from '~modules/shared/types/authentication.types';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { navigate } from '~modules/shared/helpers/link';
import { PickerItem } from '~modules/shared/types/content-picker';
import { ValueOf } from '~modules/shared/types';
import { useUserGroupOptions } from '~modules/user-group/hooks/useUserGroupOptions';
import { ADMIN_PATH } from '~modules/shared/consts/admin.const';

const NavigationEdit: FunctionComponent = () => {
	const { t } = useTranslation();
	const history = Config.getConfig().services.router.useHistory();

	const { menu: menuParentId, id: menuItemId } = Config.getConfig().services.router.useParams(); // TODO test
	const menuName = startCase(menuParentId);

	// Hooks
	const [menuForm, setMenuForm] = useState<Avo.Menu.Menu>(
		INITIAL_NAVIGATION_FORM(menuParentId ? String(menuParentId) : '0') as Avo.Menu.Menu
	);
	const [initialMenuItem, setInitialMenuItem] = useState<Avo.Menu.Menu | null>(null);
	const [menuItems, setMenuItems] = useState<Avo.Menu.Menu[]>([]);
	const [formErrors, setFormErrors] = useState<NavigationEditFormErrorState>({});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [permissionWarning, setPermissionWarning] = useState<ReactNode | null>(null);
	const [allUserGroups] = useUserGroupOptions('TagInfo', true) as [TagInfo[], boolean];

	// Fetch menu items depending on menu parent param
	// This is necessary for populating the menu parent options for our form
	useEffect(() => {
		NavigationService.fetchNavigationItems(menuParentId)
			.then((menuItemsByPosition) => {
				if (menuItemsByPosition && menuItemsByPosition.length) {
					setMenuItems(menuItemsByPosition);
				} else {
					// Go back to overview if no menu items are present
					Config.getConfig().services.toastService.showToast({
						title: Config.getConfig().services.i18n.t('Error'),
						description: Config.getConfig().services.i18n.t(
							'admin/menu/views/menu-edit___er-werden-geen-navigatie-items-gevonden-voor-menu-name',
							{
								menuName,
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
	}, [history, menuName, menuParentId, t]);

	// Fetch menu item by id
	useEffect(() => {
		if (menuItemId) {
			setIsLoading(true);
			// Fetch menu item by id so we can populate our form for editing
			NavigationService.fetchNavigationItemById(Number(menuItemId))
				.then((menuItem: Avo.Menu.Menu | null) => {
					if (menuItem) {
						// Remove unnecessary props for saving
						delete (menuItem as any).__typename;

						setInitialMenuItem(menuItem);
						setMenuForm({
							description: menuItem.description || '',
							icon_name: menuItem.icon_name as IconName,
							label: menuItem.label,
							content_type: menuItem.content_type || 'COLLECTION',
							content_path: String(menuItem.content_path || ''),
							link_target: menuItem.link_target || '_self',
							user_group_ids: menuItem.user_group_ids || [],
							placement: menuItem.placement || null,
							tooltip: menuItem.tooltip,
						} as Avo.Menu.Menu);
					}
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [menuItemId, menuParentId]);

	const checkMenuItemContentPagePermissionsMismatch = useCallback(
		(response) => {
			let contentUserGroupIds: number[] = get(
				response,
				'data.app_content[0].user_group_ids',
				[]
			);
			const navItemUserGroupIds: number[] = menuForm.user_group_ids || [];
			const allUserGroupIds: number[] = allUserGroups.map((ug) => ug.value as number);

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
		[setPermissionWarning, menuForm.user_group_ids, allUserGroups, t]
	);

	// Check if the navigation item is visible for users that do not have access to the selected content page
	// TODO -- skipped for  now
	// useEffect(() => {
	// 	if (menuForm.content_type === 'CONTENT_PAGE' && menuForm.content_path) {
	// 		// Check if permissions are more strict than the permissions on the content_page
	// 		dataService
	// 			.query({
	// 				query: GET_PERMISSIONS_FROM_CONTENT_PAGE_BY_PATH,
	// 				variables: {
	// 					path: menuForm.content_path,
	// 				},
	// 			})
	// 			.then((response) => {
	// 				checkMenuItemContentPagePermissionsMismatch(response);
	// 			})
	// 			.catch((err) => {
	// 				console.error(
	// 					new CustomError('Failed to get permissions from page', err, {
	// 						query: 'GET_PERMISSIONS_FROM_CONTENT_PAGE_BY_PATH',
	// 						variables: {
	// 							path: menuForm.content_path,
	// 						},
	// 					})
	// 				);
	// 				Config.getConfig().services.toastService.showToast({
	// 					title: Config.getConfig().services.i18n.t('Error'),
	// 					description: Config.getConfig().services.i18n.t(
	// 						'admin/menu/views/menu-edit___het-controleren-of-de-permissies-van-de-pagina-overeenkomen-met-de-zichtbaarheid-van-dit-navigatie-item-is-mislukt'
	// 					),
	// 					type: ToastType.ERROR,
	// 				});
	// 			});
	// 	}
	// }, [
	// 	menuForm.content_type,
	// 	menuForm.content_path,
	// 	menuForm.user_group_ids,
	// 	checkMenuItemContentPagePermissionsMismatch,
	// 	t,
	// ]);

	// Computed
	const pageType: NavigationEditPageType = menuItemId ? 'edit' : 'create';
	const pageTitle = menuParentId
		? `${menuName}: item ${GET_PAGE_TYPES_LANG()[pageType]}`
		: t('admin/menu/views/menu-edit___navigatie-toevoegen');
	const menuParentOptions = uniqBy(
		compact(
			menuItems.map((menuItem) => {
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
		key: keyof Avo.Menu.Menu | 'content',
		value: ValueOf<Avo.Menu.Menu> | PickerItem | null
	): void => {
		if (key === 'content') {
			setMenuForm({
				...menuForm,
				content_type: get(value, 'type'),
				content_path: get(value, 'value'),
				link_target: get(value, 'target', '_self'),
			});
		} else {
			setMenuForm({
				...menuForm,
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

			const menuItem: Partial<Avo.Menu.Menu> = {
				icon_name: menuForm.icon_name,
				label: menuForm.label,
				content_path: menuForm.content_path,
				content_type: menuForm.content_type,
				link_target: menuForm.link_target,
				user_group_ids: menuForm.user_group_ids,
				placement: menuForm.placement,
				tooltip: menuForm.tooltip,
			};

			if (pageType === 'create') {
				await NavigationService.insertNavigationItem({
					...menuItem,
					// Get description from existing items or use form description field
					description: get(menuItems, '[0].description', menuForm.description),
					position: menuItems.length,
				});
				navigate(history, ADMIN_PATH.NAVIGATION_DETAIL, {
					menu: menuForm.placement as string,
				});
				Config.getConfig().services.toastService.showToast({
					title: Config.getConfig().services.i18n.t('Success'),
					description: Config.getConfig().services.i18n.t(
						'admin/menu/views/menu-edit___het-navigatie-item-is-succesvol-aangemaakt'
					),
					type: ToastType.SUCCESS,
				});
			} else {
				if (isNil(menuItemId)) {
					throw new CustomError('cannot update menu item because id is undefined', null, {
						menuItemId,
					});
				}
				await NavigationService.updateNavigationItems([
					{
						...initialMenuItem,
						...menuItem,
						id: +menuItemId,
						updated_at: new Date().toISOString(),
					} as Avo.Menu.Menu,
				]);
				navigate(history, ADMIN_PATH.NAVIGATION_DETAIL, {
					menu: menuForm.placement as string,
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
					menuForm,
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

		if (!menuParentId && !menuForm.placement) {
			errors.placement = t('admin/menu/views/menu-edit___navigatie-naam-is-verplicht');
		}

		if (!menuForm.content_path) {
			errors.content_path = t('admin/menu/views/menu-edit___link-is-verplicht');
		}

		setFormErrors(errors);

		return Object.keys(errors).length === 0;
	};

	const navigateBack = (): void => {
		if (menuParentId) {
			navigate(history, NAVIGATION_PATH.NAVIGATION_DETAIL, {
				menu: menuParentId,
			});
		} else {
			navigate(history, NAVIGATION_PATH.NAVIGATION_OVERVIEW);
		}
	};

	// Render
	return isLoading ? (
		<Flex orientation="horizontal" center>
			<Spinner size="large" />
		</Flex>
	) : (
		// TODO demo page
		// <AdminLayout
		// 	onClickBackButton={() => navigate(history, ADMIN_PATH.MENU_OVERVIEW)}
		// 	pageTitle={pageTitle}
		// 	size="large"
		// >
		// 	<AdminLayoutTopBarRight>
		// 		<ButtonToolbar>
		// 			<Button
		// 				label={t('admin/menu/views/menu-edit___annuleer')}
		// 				onClick={navigateBack}
		// 				type="tertiary"
		// 			/>
		// 			<Button
		// 				disabled={isSaving}
		// 				label={t('admin/menu/views/menu-edit___opslaan')}
		// 				onClick={handleSave}
		// 			/>
		// 		</ButtonToolbar>
		// 	</AdminLayoutTopBarRight>
		// 	<AdminLayoutBody>
		<NavigationEditForm
			formErrors={formErrors}
			formState={menuForm}
			navigationParentId={menuParentId}
			navigationParentOptions={menuParentOptions}
			onChange={handleChange}
			permissionWarning={permissionWarning}
		/>
	);
};

export default NavigationEdit;
