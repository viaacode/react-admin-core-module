import { cloneDeep, isEqual, isNil, startCase } from 'lodash-es';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';

import {
	Button,
	ButtonGroup,
	ButtonToolbar,
	Flex,
	IconName,
	Spacer,
	Table,
} from '@viaa/avo2-components';

import { NAVIGATION_PATH } from '../navigation.consts';
import { NavigationService } from '../navigation.service';

import './NavigationDetail.scss';
import { useTranslation } from '~modules/shared/hooks/useTranslation';
import { LoadingInfo } from '~modules/shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import DeleteObjectModal from '~modules/shared/components/ConfirmModal/ConfirmModal';
import { Config, ToastType } from '~core/config';
import { navigate } from '~modules/shared/helpers/link';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { AdminLayout } from '~modules/shared/layouts';
import { Loader } from '~modules/shared/components';
import { NavigationItem } from '../navigation.types';

export interface NavigationDetailProps {
	navigationBarId: string;
}

const NavigationDetail: FC<NavigationDetailProps> = ({ navigationBarId }) => {
	const { t } = useTranslation();
	const history = Config.getConfig().services.router.useHistory();

	const [activeItemId, setActiveItemId] = useState<string | null>(null);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
	const [idToDelete, setIdToDelete] = useState<string | null>(null);
	const [navigationItems, setNavigationItems] = useState<NavigationItem[] | null>(null);
	const [initialNavigationItems, setInitialNavigationItems] = useState<NavigationItem[] | null>(
		null
	);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });

	const timeout = useRef<NodeJS.Timeout | null>(null);

	const fetchNavigationItems = useCallback(async () => {
		try {
			const tempMenuItems = await NavigationService.fetchNavigationItems(navigationBarId);

			// Set items position property equal to index in array
			const reindexedMenuItems = reindexNavigationItems(tempMenuItems);

			setInitialNavigationItems(reindexedMenuItems);
			setNavigationItems(reindexedMenuItems);
		} catch (err) {
			console.error('Failed to fetch menu items', err, { navigationBarId });
			setLoadingInfo({
				state: 'error',
				message: t('admin/menu/views/menu-detail___het-laden-van-de-menu-items-is-mislukt'),
			});
		}
	}, [navigationBarId, setNavigationItems, setLoadingInfo, t]);

	useEffect(() => {
		fetchNavigationItems();
	}, [fetchNavigationItems]);

	useEffect(() => {
		if (navigationItems) {
			setLoadingInfo({ state: 'loaded' });
		}
	}, [navigationItems, setLoadingInfo]);

	useEffect(() => {
		// Reset active row to clear styling
		timeout.current = setTimeout(() => {
			setActiveItemId(null);
		}, 1000);

		return () => {
			if (timeout.current) {
				clearTimeout(timeout.current);
			}
		};
	}, [activeItemId]);

	// Methods
	const handleDelete = async (): Promise<void> => {
		try {
			if (isNil(idToDelete)) {
				throw new CustomError('The idToDelete is not defined', null, { idToDelete });
			}
			await NavigationService.deleteNavigationItem(idToDelete);
			fetchNavigationItems();
			Config.getConfig().services.toastService.showToast({
				title: Config.getConfig().services.i18n.t('Success'),
				description: Config.getConfig().services.i18n.t(
					'admin/menu/views/menu-detail___het-navigatie-item-is-succesvol-verwijderd'
				),
				type: ToastType.SUCCESS,
			});
		} catch (err) {
			console.error(new CustomError('Failed to delete menu item', err, { idToDelete }));
			Config.getConfig().services.toastService.showToast({
				title: Config.getConfig().services.i18n.t('Error'),
				description: Config.getConfig().services.i18n.t(
					'admin/menu/views/menu-detail___het-verwijderen-van-het-navigatie-item-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}
	};

	const handleNavigate = (path: string, params: { [key: string]: string } = {}): void => {
		navigate(history, path, params);
	};

	const handleSave = async () => {
		try {
			if (!navigationItems) {
				return;
			}
			setIsSaving(true);

			await NavigationService.updateNavigationItems(navigationItems);

			fetchNavigationItems();
			Config.getConfig().services.toastService.showToast({
				title: Config.getConfig().services.i18n.t('Success'),
				description: Config.getConfig().services.i18n.t(
					'admin/menu/views/menu-detail___de-navigatie-items-zijn-succesvol-opgeslagen'
				),
				type: ToastType.SUCCESS,
			});
		} catch (err) {
			console.error(
				new CustomError('Failed to update menu items', err, { menuItems: navigationItems })
			);
			Config.getConfig().services.toastService.showToast({
				title: Config.getConfig().services.i18n.t('Error'),
				description: Config.getConfig().services.i18n.t(
					'admin/menu/views/menu-detail___het-opslaan-van-de-navigatie-items-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}
	};

	const openConfirmModal = (id: string): void => {
		setIdToDelete(id);
		setIsConfirmModalOpen(true);
	};

	const reindexNavigationItems = (items: NavigationItem[]): NavigationItem[] =>
		items.map((item, index) => {
			item.position = index;
			// Remove properties that we don't need for save
			delete (item as any).__typename;

			return item;
		});

	const reorderMenuItem = (currentIndex: number, indexUpdate: number, id: string): void => {
		if (!navigationItems) {
			return;
		}
		const newIndex = currentIndex + indexUpdate;
		const navigationItemsCopy = cloneDeep(navigationItems);
		// Get updated item and remove it from copy
		const updatedItem = navigationItemsCopy.splice(currentIndex, 1)[0];
		// Add item back at new index
		navigationItemsCopy.splice(newIndex, 0, updatedItem);

		setActiveItemId(id);
		setNavigationItems(reindexNavigationItems(navigationItemsCopy));
	};

	// Render
	const renderReorderButton = (
		dir: 'up' | 'down',
		index: number,
		id: string,
		disabled: boolean
	) => {
		const decrease = dir === 'up';
		const indexUpdate = decrease ? -1 : 1;

		return (
			<Button
				icon={`chevron-${dir}` as IconName}
				onClick={() => reorderMenuItem(index, indexUpdate, id)}
				title={
					dir === 'up'
						? t('admin/menu/views/menu-detail___verplaats-het-item-naar-boven')
						: t('admin/menu/views/menu-detail___verplaats-het-item-naar-onder')
				}
				ariaLabel={
					dir === 'up'
						? t('admin/menu/views/menu-detail___verplaats-het-item-naar-boven')
						: t('admin/menu/views/menu-detail___verplaats-het-item-naar-onder')
				}
				type="secondary"
				disabled={disabled}
			/>
		);
	};

	const renderNavigationDetail = () => {
		// Return to overview if menu is empty
		if (!navigationItems) {
			Config.getConfig().services.toastService.showToast({
				title: Config.getConfig().services.i18n.t('Error'),
				description: Config.getConfig().services.i18n.t(
					'admin/menu/views/menu-detail___er-werden-geen-navigatie-items-gevonden'
				),
				type: ToastType.ERROR,
			});
			handleNavigate(NAVIGATION_PATH.NAVIGATION_OVERVIEW);
			return null;
		}

		const isFirst = (i: number) => i === 0;
		const isLast = (i: number) => i === navigationItems.length - 1;

		return (
			<>
				<Table align className="c-menu-detail__table" variant="styled">
					<tbody>
						{navigationItems.map((item, index) => (
							<tr
								key={`nav-edit-${item.id}`}
								className={
									activeItemId === item.id
										? 'c-menu-detail__table-row--active'
										: ''
								}
							>
								<td className="o-table-col-1">
									<ButtonGroup>
										{renderReorderButton('up', index, item.id, isFirst(index))}
										{renderReorderButton('down', index, item.id, isLast(index))}
									</ButtonGroup>
								</td>
								<td>{item.label || item.tooltip || item.content_path}</td>
								<td>
									<ButtonToolbar>
										<Button
											icon="edit-2"
											onClick={() =>
												handleNavigate(
													NAVIGATION_PATH.NAVIGATION_ITEM_EDIT,
													{
														navigationBarId,
														navigationItemId: String(item.id),
													}
												)
											}
											title={t(
												'admin/menu/views/menu-detail___bewerk-dit-navigatie-item'
											)}
											ariaLabel={t(
												'admin/menu/views/menu-detail___bewerk-dit-navigatie-item'
											)}
											type="secondary"
										/>
										<Button
											icon="delete"
											title={t(
												'admin/menu/views/menu-detail___verwijder-dit-navigatie-item'
											)}
											ariaLabel={t(
												'admin/menu/views/menu-detail___verwijder-dit-navigatie-item'
											)}
											onClick={() => openConfirmModal(item.id)}
											type="danger-hover"
										/>
									</ButtonToolbar>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
				<Spacer margin="top">
					<Flex center>
						<Button
							icon="plus"
							label={t('admin/menu/views/menu-detail___voeg-een-item-toe')}
							onClick={() =>
								handleNavigate(NAVIGATION_PATH.NAVIGATION_ITEM_CREATE, {
									navigationBarId,
								})
							}
							type="primary"
						/>
					</Flex>
				</Spacer>
				<DeleteObjectModal
					deleteObjectCallback={handleDelete}
					isOpen={isConfirmModalOpen}
					onClose={() => setIsConfirmModalOpen(false)}
				/>
			</>
		);
	};

	const renderPageContent = () => {
		if (loadingInfo.state === 'loading') {
			return <Loader />;
		}
		return (
			<AdminLayout pageTitle={t('Navigatie balk: ') + startCase(navigationBarId)}>
				<AdminLayout.Actions>
					<ButtonToolbar>
						<Button
							label={t('admin/menu/views/menu-detail___annuleer')}
							onClick={() => history.push(NAVIGATION_PATH.NAVIGATION_OVERVIEW)}
							type="tertiary"
						/>
						<Button
							disabled={isEqual(initialNavigationItems, navigationItems) || isSaving}
							label={t('admin/menu/views/menu-detail___opslaan')}
							onClick={() => handleSave()}
						/>
					</ButtonToolbar>
				</AdminLayout.Actions>
				<AdminLayout.Content>{renderNavigationDetail()}</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return renderPageContent();
};

export default NavigationDetail;
