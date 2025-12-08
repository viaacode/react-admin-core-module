import type { IconName } from '@viaa/avo2-components';
import { Button, ButtonToolbar, Table } from '@viaa/avo2-components';
import { startCase } from 'es-toolkit';
import type { FunctionComponent } from 'react';
import React from 'react';
import { AdminConfigManager } from '~core/config/config.class';
import { useGetNavigationBars } from '~modules/navigation/hooks/use-get-navigation-bars';
import { GET_NAVIGATION_OVERVIEW_TABLE_COLS } from '~modules/navigation/navigation.consts';
import { Link } from '~modules/shared/components/Link/Link';
import { Loader } from '~shared/components/Loader/Loader';
import { buildLink, navigate } from '~shared/helpers/routing/link';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import type { NavigationItem, NavigationOverviewTableCols } from '../navigation.types';

export const NavigationBarOverview: FunctionComponent = () => {
	const {
		data: navigationItems,
		isLoading: isLoadingNavigationItems,
		isError: isErrorNavigationItems,
	} = useGetNavigationBars();

	const renderTableCell = (
		rowData: Partial<NavigationItem>,
		columnId: NavigationOverviewTableCols
	) => {
		const placement = rowData.placement || undefined;

		switch (columnId) {
			case 'placement':
				return (
					<Link
						to={buildLink(AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_DETAIL'), {
							navigationBarId: placement,
						})}
					>
						{startCase(placement || '')}
					</Link>
				);
			case 'actions':
				return (
					<ButtonToolbar>
						<Button
							icon={'eye' as IconName}
							onClick={() =>
								navigate(AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_DETAIL'), {
									navigationBarId: placement,
								})
							}
							size="small"
							title={tText(
								'admin/menu/views/menu-overview___bekijk-de-navigatie-items-voor-deze-navigatie-balk'
							)}
							ariaLabel={tText(
								'admin/menu/views/menu-overview___bekijk-de-navigatie-items-voor-deze-navigatie-balk'
							)}
							type="secondary"
						/>
						<Button
							icon={'plus' as IconName}
							onClick={() =>
								navigate(AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_ITEM_CREATE'), {
									navigationBarId: placement,
								})
							}
							size="small"
							title={tText(
								'admin/menu/views/menu-overview___voeg-een-navigatie-item-toe-aan-deze-navigatie-balk'
							)}
							ariaLabel={tText(
								'admin/menu/views/menu-overview___voeg-een-navigatie-item-toe-aan-deze-navigatie-balk'
							)}
							type="secondary"
						/>
					</ButtonToolbar>
				);
			default:
				return rowData[columnId];
		}
	};

	const renderMenuOverview = () => {
		if (!navigationItems?.length) {
			return (
				<>
					<div>
						{tHtml('admin/menu/views/menu-overview___er-zijn-nog-geen-navigaties-aangemaakt')}
					</div>
					<div>
						{tHtml(
							'admin/menu/views/menu-overview___beschrijving-hoe-navigatie-items-toe-te-voegen'
						)}
					</div>
				</>
			);
		}

		const columns = GET_NAVIGATION_OVERVIEW_TABLE_COLS();
		return (
			<Table
				columns={columns}
				data={navigationItems}
				renderCell={(rowData: Partial<NavigationItem>, columnId: string) =>
					renderTableCell(rowData, columnId as NavigationOverviewTableCols)
				}
				rowKey="id"
				variant="bordered"
			/>
		);
	};

	const renderPageContent = () => {
		if (isLoadingNavigationItems) {
			return <Loader />;
		}
		if (isErrorNavigationItems) {
			return (
				<div>
					{tHtml(
						'modules/navigation/views/navigation-overview___het-ophalen-van-de-navigatie-balken-is-mislukt'
					)}
				</div>
			);
		}
		return renderMenuOverview();
	};

	return renderPageContent();
};
