import { startCase } from 'lodash-es';
import type { FunctionComponent } from 'react';
import React from 'react';

import type { IconName } from '@viaa/avo2-components';
import { Button, ButtonToolbar, Table } from '@viaa/avo2-components';
import { useGetNavigationBars } from '~modules/navigation/hooks/use-get-navigation-bars';

import type { NavigationItem, NavigationOverviewTableCols } from '../navigation.types';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import { AdminConfigManager } from '~core/config';
import { buildLink, navigate } from '~shared/helpers/link';
import { GET_NAVIGATION_OVERVIEW_TABLE_COLS } from '~modules/navigation/navigation.consts';
import { Loader } from '~shared/components/Loader';
import { AdminLayout } from '~shared/layouts';
import { Link } from '~modules/shared/components/Link';

export const NavigationBarOverview: FunctionComponent = () => {
	const history = AdminConfigManager.getConfig().services.router.useHistory();
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
								navigate(history, AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_DETAIL'), {
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
								navigate(
									history,
									AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_ITEM_CREATE'),
									{
										navigationBarId: placement,
									}
								)
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
		const title = tText('admin/menu/views/menu-overview___navigatie-overzicht');
		return (
			<AdminLayout pageTitle={title}>
				{/* TODO re-enable once we want to allow meemoo to create new navigation bars, usually this isn't needed, since new navigation bars always require new development work */}
				{/*<AdminLayout.Actions>*/}
				{/*	<ButtonToolbar>*/}
				{/*		<Button*/}
				{/*			label={tText('admin/menu/views/menu-overview___navigatie-toevoegen')}*/}
				{/*			onClick={() =>*/}
				{/*				history.push(AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_CREATE'))*/}
				{/*			}*/}
				{/*		/>*/}
				{/*	</ButtonToolbar>*/}
				{/*</AdminLayout.Actions>*/}
				<AdminLayout.Content>
					<Table
						columns={columns}
						data={navigationItems}
						renderCell={(rowData: Partial<NavigationItem>, columnId: string) =>
							renderTableCell(rowData, columnId as NavigationOverviewTableCols)
						}
						rowKey="id"
						variant="bordered"
					/>
				</AdminLayout.Content>
			</AdminLayout>
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
