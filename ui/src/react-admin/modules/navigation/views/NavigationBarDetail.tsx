import './NavigationBarOverview.scss';

import type { IconName } from '@viaa/avo2-components';
import { Button, ButtonGroup, ButtonToolbar, Flex, Spacer } from '@viaa/avo2-components';

import { cloneDeep, isNil, startCase } from 'lodash-es';
import type { FC, ReactElement, ReactNode } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { invalidateNavigationQueries } from '~modules/navigation/helpers/invalidate-navigation-queries';
import { reindexNavigationItems } from '~modules/navigation/helpers/reorder-navigation-items';
import { useGetNavigationBarItems } from '~modules/navigation/hooks/use-get-navigation-bar-items';
import { showToast } from '~modules/shared/helpers/show-toast';
import { useGetAllLanguages } from '~modules/translations/hooks/use-get-all-languages';
import type { LanguageInfo } from '~modules/translations/translations.types';
import { Icon, Loader } from '~shared/components';
import type {
	CheckboxDropdownModalProps,
	CheckboxOption,
} from '~shared/components/CheckboxDropdownModal/CheckboxDropdownModal';
import DeleteObjectModal from '~shared/components/ConfirmModal/ConfirmModal';
import FilterTable from '~shared/components/FilterTable/FilterTable';
import { GET_LANGUAGE_NAMES } from '~shared/consts/language-names';
import { CustomError } from '~shared/helpers/custom-error';
import { isMultiLanguageEnabled } from '~shared/helpers/is-multi-language-enabled';
import { navigate } from '~shared/helpers/link';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import { AdminLayout } from '~shared/layouts';
import { TableColumnDataType } from '~shared/types/table-column-data-type';
import { TableFilterType } from '~shared/types/table-filter-types';

import { NavigationService } from '../navigation.service';
import type {
	NavigationItem,
	NavigationItemOverviewTableCols,
	NavigationItemsTableState,
} from '../navigation.types';

export interface NavigationDetailProps {
	navigationBarId: string;
	onGoBack: () => void;
}

export const NavigationBarDetail: FC<NavigationDetailProps> = ({ navigationBarId, onGoBack }) => {
	const history = AdminConfigManager.getConfig().services.router.useHistory();

	const [activeItemId, setActiveItemId] = useState<string | null>(null);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
	const [idToDelete, setIdToDelete] = useState<string | null>(null);
	const [navigationItems, setNavigationItems] = useState<NavigationItem[] | null>(null);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [tableState, setTableState] = useState<Partial<NavigationItemsTableState>>({});
	const {
		data: initialNavigationItems,
		isLoading: isLoadingNavigationItems,
		isError: isErrorNavigationItems,
		refetch: refetchNavigationItems,
	} = useGetNavigationBarItems(navigationBarId, tableState.language, tableState.query);
	const { data: allLanguages } = useGetAllLanguages();

	const languageOptions = (allLanguages || []).map(
		(languageInfo: LanguageInfo): CheckboxOption => ({
			id: languageInfo.languageCode,
			label: GET_LANGUAGE_NAMES()[languageInfo.languageCode],
			checked: (tableState?.language || []).includes(languageInfo.languageCode),
		})
	);

	const timeout = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		refetchNavigationItems();
	}, [tableState, refetchNavigationItems]);

	useEffect(() => {
		if (!isLoadingNavigationItems && !isErrorNavigationItems && initialNavigationItems) {
			setNavigationItems(initialNavigationItems);
		}
	}, [isLoadingNavigationItems, isErrorNavigationItems, initialNavigationItems]);

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
			await invalidateNavigationQueries();
			await refetchNavigationItems();

			showToast({
				title: tText('modules/navigation/views/navigation-detail___success'),
				description: tText(
					'admin/menu/views/menu-detail___het-navigatie-item-is-succesvol-verwijderd'
				),
				type: ToastType.SUCCESS,
			});
		} catch (err) {
			console.error(new CustomError('Failed to delete menu item', err, { idToDelete }));
			showToast({
				title: tText('modules/navigation/views/navigation-detail___error'),
				description: tText(
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
			await invalidateNavigationQueries();
			showToast({
				title: tText('modules/navigation/views/navigation-detail___success'),
				description: tText(
					'admin/menu/views/menu-detail___de-navigatie-items-zijn-succesvol-opgeslagen'
				),
				type: ToastType.SUCCESS,
			});
		} catch (err) {
			console.error(
				new CustomError('Failed to update menu items', err, { menuItems: navigationItems })
			);
			showToast({
				title: tText('modules/navigation/views/navigation-detail___error'),
				description: tText(
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
						? tText('admin/menu/views/menu-detail___verplaats-het-item-naar-boven')
						: tText('admin/menu/views/menu-detail___verplaats-het-item-naar-onder')
				}
				ariaLabel={
					dir === 'up'
						? tText('admin/menu/views/menu-detail___verplaats-het-item-naar-boven')
						: tText('admin/menu/views/menu-detail___verplaats-het-item-naar-onder')
				}
				type="secondary"
				disabled={disabled}
			/>
		);
	};

	const renderTableCell = (
		navigationItem: NavigationItem,
		columnId: NavigationItemOverviewTableCols,
		rowIndex: number
	): ReactNode => {
		switch (columnId) {
			case 'sort': {
				const isFirst = (i: number) => i === 0;
				const isLast = (i: number) => i === (navigationItems || []).length - 1;
				return (
					<ButtonGroup>
						{renderReorderButton('up', rowIndex, navigationItem.id, isFirst(rowIndex))}
						{renderReorderButton('down', rowIndex, navigationItem.id, isLast(rowIndex))}
					</ButtonGroup>
				);
			}

			case 'label':
				return navigationItem.label || navigationItem.tooltip || navigationItem.contentPath;

			case 'language':
				return navigationItem.language;

			case 'actions':
				return (
					<ButtonToolbar>
						<Button
							icon={'edit2' as IconName}
							onClick={() =>
								handleNavigate(
									AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_ITEM_EDIT'),
									{
										navigationBarId,
										navigationItemId: String(navigationItem.id),
									}
								)
							}
							title={tText(
								'admin/menu/views/menu-detail___bewerk-dit-navigatie-item'
							)}
							ariaLabel={tText(
								'admin/menu/views/menu-detail___bewerk-dit-navigatie-item'
							)}
							type="secondary"
						/>
						<Button
							icon={'delete' as IconName}
							title={tText(
								'admin/menu/views/menu-detail___verwijder-dit-navigatie-item'
							)}
							ariaLabel={tText(
								'admin/menu/views/menu-detail___verwijder-dit-navigatie-item'
							)}
							onClick={() => openConfirmModal(navigationItem.id)}
							type="danger-hover"
						/>
					</ButtonToolbar>
				);
		}
	};

	const renderNavigationDetail = () => {
		return (
			<>
				<FilterTable
					dataCount={100}
					itemsPerPage={100}
					onTableStateChanged={setTableState}
					isLoading={isLoadingNavigationItems}
					showCheckboxes={false}
					showPagination={false}
					showColumnsVisibility={false}
					className="c-navigation-detail__table"
					variant="styled"
					data={navigationItems || []}
					searchTextPlaceholder={tText(
						'modules/navigation/views/navigation-bar-detail___zoek-op-navigatie-item-label'
					)}
					noContentMatchingFiltersMessage={tText(
						'modules/navigation/views/navigation-bar-detail___er-zijn-geen-navigatie-items-in-de-huidige-navigatie-balk-die-voldoen-aan-je-filters'
					)}
					renderNoResults={() =>
						tHtml(
							'modules/navigation/views/navigation-detail___deze-navigatie-balk-heeft-nog-geen-items'
						) as ReactElement
					}
					columns={[
						{
							id: 'sort',
							visibleByDefault: true,
						},
						{
							id: 'label',
							label: tText('modules/navigation/views/navigation-detail___label'),
							dataType: 'string',
							visibleByDefault: true,
						},
						...(isMultiLanguageEnabled()
							? [
									{
										id: 'language',
										label: tText(
											'modules/navigation/views/navigation-bar-detail___taal'
										),
										visibleByDefault: true,
										filterType: TableFilterType.CheckboxDropdownModal,
										filterProps: {
											options: languageOptions,
										} as CheckboxDropdownModalProps,
										dataType: TableColumnDataType.string,
									},
							  ]
							: []),
						{
							id: 'actions',
							visibleByDefault: true,
						},
					]}
					renderCell={renderTableCell as any}
					rowKey="id"
					searchInputAriaLabel={tText(
						'modules/navigation/views/navigation-bar-detail___zoek-input-aria-label'
					)}
				/>
				<Spacer margin="top">
					<Flex center>
						<Button
							icon={'plus' as IconName}
							label={tText('admin/menu/views/menu-detail___voeg-een-item-toe')}
							onClick={() =>
								handleNavigate(
									AdminConfigManager.getAdminRoute(
										'ADMIN_NAVIGATION_ITEM_CREATE'
									),
									{
										navigationBarId,
									}
								)
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
		if (isLoadingNavigationItems) {
			return <Loader />;
		}
		if (isErrorNavigationItems) {
			return (
				<p>
					{tHtml(
						'modules/navigation/views/navigation-detail___het-laden-van-de-navigatie-balk-items-is-mislukt'
					)}
				</p>
			);
		}
		return (
			<AdminLayout
				pageTitle={
					tText('modules/navigation/views/navigation-detail___navigatie-balk') +
					' ' +
					startCase(navigationBarId)
				}
			>
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
								history.push(
									AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_OVERVIEW')
								)
							}
							type="tertiary"
						/>
						<Button
							disabled={isSaving}
							label={tText('admin/menu/views/menu-detail___opslaan')}
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
