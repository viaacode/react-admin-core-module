import { startCase } from 'lodash-es';
import React, { FunctionComponent } from 'react';

import { Button, ButtonToolbar, Table } from '@viaa/avo2-components';

import { NavigationItem, NavigationOverviewTableCols } from '../navigation.types';
import { useTranslation } from '~modules/shared/hooks/useTranslation';
import { Config } from '~core/config';
import { buildLink, navigate } from '~modules/shared/helpers/link';
import { useGetAllNavigations } from '~modules/navigation/hooks/get-all-navigations';
import {
	GET_NAVIGATION_OVERVIEW_TABLE_COLS,
	NAVIGATION_PATH,
} from '~modules/navigation/navigation.consts';
import { Loader } from '~modules/shared/components';

const NavigationOverview: FunctionComponent = () => {
	const { t } = useTranslation();
	const Link = Config.getConfig().services.router.Link;
	const history = Config.getConfig().services.router.useHistory();
	const {
		data: navigationItems,
		isLoading: isLoadingNavigationItems,
		isError: isErrorNavigationItems,
	} = useGetAllNavigations();

	const renderTableCell = (
		rowData: Partial<NavigationItem>,
		columnId: NavigationOverviewTableCols
	) => {
		const placement = rowData.placement || undefined;

		switch (columnId) {
			case 'placement':
				return (
					<Link
						to={buildLink(NAVIGATION_PATH.NAVIGATION_DETAIL, {
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
							icon="eye"
							onClick={() =>
								navigate(history, NAVIGATION_PATH.NAVIGATION_DETAIL, {
									navigationBarId: placement,
								})
							}
							size="small"
							title={t(
								'admin/menu/views/menu-overview___bekijk-de-navigatie-items-voor-deze-navigatie-balk'
							)}
							ariaLabel={t(
								'admin/menu/views/menu-overview___bekijk-de-navigatie-items-voor-deze-navigatie-balk'
							)}
							type="secondary"
						/>
						<Button
							icon="plus"
							onClick={() =>
								navigate(history, NAVIGATION_PATH.NAVIGATION_ITEM_CREATE, {
									navigationBarId: placement,
								})
							}
							size="small"
							title={t(
								'admin/menu/views/menu-overview___voeg-een-navigatie-item-toe-aan-deze-navigatie-balk'
							)}
							ariaLabel={t(
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
						{t(
							'admin/menu/views/menu-overview___er-zijn-nog-geen-navigaties-aangemaakt'
						)}
					</div>
					<div>
						{t(
							'admin/menu/views/menu-overview___beschrijving-hoe-navigatie-items-toe-te-voegen'
						)}
					</div>
				</>
			);
		}

		return (
			<Table
				columns={GET_NAVIGATION_OVERVIEW_TABLE_COLS()}
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
			return <div>{t('Het ophalen van de navigatie balken is mislukt')}</div>;
		}
		return renderMenuOverview();
	};

	return renderPageContent();
};

export default NavigationOverview;
